import classNames from 'classnames';
import joi from 'joi';
import type React from 'react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { imageProxyURL } from '../../../config/config';
import { namespace } from '../../../package.json';
import cache from '../../cache';
import { SCREENSHOT_WIDTH } from '../../constants/label';
import * as TEXTS from '../../constants/texts';
import { isMobileMode } from '../../helpers/app';
import * as gtag from '../../helpers/gtag';
import * as LIHKG from '../../helpers/lihkg';
import { mapValidationError } from '../../helpers/validation';
import useScreenshot, { UseScreenshot } from '../../hooks/useScreenshot';
import useLabelSourcePost from '../../hooks/useLabelSourcePost';
import type { ILabel } from '../../models/Label';
import { color, image, reason, text } from '../../schemas/label';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { EventAction, EventCategory } from '../../types/ga';
import ColorPicker from '../ColorPicker/ColorPicker';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './LabelForm.module.scss';

type TLabelData = Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>;

export type TFormData = TLabelData & {
  meta: {
    screenshot?: UseScreenshot.IResult;
  };
};

enum ToggleButtonName {
  Color = 'isCustomColorEnabled',
  Screenshot = 'isScreenshotEnabled'
}

interface IInputErrors {
  [name: string]: string | undefined;
}

export interface IProps {
  /**
   * the target user ID
   */
  user: string;
  /**
   * the label to be edited
   */
  label?: TLabelData;
  /**
   * the loading state
   */
  loading?: boolean;
  /**
   * custom onSubmit event handler
   * @async
   * @throws {string} error message
   */
  onSubmit: (data: TFormData) => Promise<void>;
}

type TComponentProps = TComponentPropsWithoutRef<'form', IProps>;

export type TProps = IProps & TComponentProps;

const schema = joi.object({
  text: text.required().messages({
    'any.required': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_REQUIRED,
    'string.empty': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_REQUIRED
  }),
  reason,
  color,
  image: image.messages({
    'string.uri': TEXTS.LABEL_FORM_FIELD_ERROR_IMAGE_INVALID,
    'string.uriCustomScheme': TEXTS.LABEL_FORM_FIELD_ERROR_IMAGE_INVALID
  }),
  meta: joi.object({
    screenshot: joi.any()
  })
}).unknown();

const initialFormData: TFormData = {
  text: '',
  meta: {}
};

const useScreenshotOptions: UseScreenshot.TOptions = {
  proxy: imageProxyURL,
  onclone: (document, element) => {
    const app = document.querySelector(lihkgSelectors.app)!;
    app.classList.add(styles.screenshot);
    if (!isMobileMode()) {
      element.style.width = `${SCREENSHOT_WIDTH}px`;
    }
  }
};

const LabelForm: React.FunctionComponent<TProps> = (props) => {
  const { id, className, user, label, loading, onSubmit, ...otherProps } = props;

  const [formData, setFormData] = useState<TFormData>(label as TFormData || initialFormData);
  const [isColorEnabled, setIsColorEnabled] = useState(!!formData.color);
  const [isScreenshotEnabled, setIsScreenshotEnabled] = useState(false);
  const [inputErrors, setInputErrors] = useState<IInputErrors>({});

  const post = useLabelSourcePost();
  const threadTitleBar = document.querySelector<HTMLDivElement>(lihkgSelectors.threadTitleBar)!;
  const replyItemInner = post && LIHKG.getReplyItemInnerElementByPostId(post.post_id);
  const elements = useMemo(() => [threadTitleBar, replyItemInner!], [threadTitleBar, replyItemInner]);
  const screenshot = useScreenshot(!!replyItemInner && isScreenshotEnabled, elements, useScreenshotOptions);

  const previewImageStyle = useMemo(() => ({
    backgroundImage: `url(${screenshot.url})`
  }), [screenshot.url]);

  const _id = id || useId();
  const _errorId = `${_id}-error`;
  const name = `${namespace}-${LabelForm.displayName!}`;

  const _user = cache.getUser(user);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setInputErrors({ ...inputErrors, [name]: undefined });
  }, [formData, inputErrors]);

  const handleToggleButtonChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked, name } = event.target;
    const mapping = {
      [ToggleButtonName.Color]: setIsColorEnabled,
      [ToggleButtonName.Screenshot]: setIsScreenshotEnabled
    };
    const setState = mapping[name as ToggleButtonName];
    setState(checked);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    const { image, meta } = formData;
    const _formData: TFormData = {
      ...formData,
      color: isColorEnabled ? formData.color : undefined, // unset if color is disabled
      image: isScreenshotEnabled ? '' : image, // unset if screenshot is enabled
      meta: { ...meta, screenshot }
    };
    const { value, error } = schema.validate(_formData);
    if (error) {
      const _inputErrors = mapValidationError<IInputErrors>(error, (inputErrors, key, label, value, message) => {
        // analytics
        gtag.event(EventAction.Error, { event_category: EventCategory.LabelForm, event_label: key });
        return { ...inputErrors, [key!]: message };
      }, { ...inputErrors });
      setInputErrors(_inputErrors);
    } else {
      try {
        await onSubmit(value);
      } catch (err) {
        if (typeof err === 'string') {
          const notification = LIHKG.createLocalNotification(err);
          LIHKG.showNotification(notification);
        }
      }
    }
  }, [onSubmit, formData, isColorEnabled, isScreenshotEnabled, inputErrors, screenshot]);

  useEffect(() => {
    if (screenshot.error) {
      setIsScreenshotEnabled(false);
      const notification = LIHKG.createLocalNotification(TEXTS.LABEL_FORM_CAPTURE_ERROR);
      LIHKG.showNotification(notification);
    }
  }, [screenshot.error]);

  return (
    <form
      {...otherProps}
      id={_id}
      name={name}
      className={classNames(className, styles.labelForm)}
      onSubmit={handleSubmit}
      aria-describedby={_errorId}
    >
      {
        _user && (
          <div className={styles.user}>
            <Icon className={styles.icon} icon={IconName.Account} />
            {_user.nickname}
          </div>
        )
      }
      {/* text */}
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_TEXT}
          name="text"
          value={formData.text || ''}
          error={inputErrors.text}
          onChange={handleInputChange}
          autoFocus
          autoComplete="on"
        />
      </div>
      {/* reason */}
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_REASON}
          placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_REASON}
          name="reason"
          value={formData.reason || ''}
          error={inputErrors.reason}
          onChange={handleInputChange}
          autoComplete="on"
        />
      </div>
      {/* color */}
      <div className={classNames(styles.inputField, styles.color)}>
        <ToggleButton
          className={styles.toggleButton}
          checked={isColorEnabled}
          name={ToggleButtonName.Color}
          disabled={loading}
          onChange={handleToggleButtonChange}
        >
          {TEXTS.LABEL_FORM_FIELD_LABEL_CUSTOM_COLOR}
          {
            isColorEnabled && (
              <ColorPicker
                className={styles.colorPicker}
                border
                rounded
                disabled={loading}
                name="color"
                value={formData.color || ''}
                error={inputErrors.color}
                onChange={handleInputChange}
              />
            )
          }
        </ToggleButton>
      </div>
      {/* screenshot */}
      <div className={classNames(styles.inputField, styles.screenshot)}>
        <ToggleButton
          className={styles.toggleButton}
          checked={isScreenshotEnabled}
          disabled={loading}
          name={ToggleButtonName.Screenshot}
          loading={screenshot.loading}
          onChange={handleToggleButtonChange}
        >
          {TEXTS.LABEL_FORM_FIELD_LABEL_CAPTURE}
        </ToggleButton>
        {
          !screenshot.loading && !!screenshot.url && (
            <div className={styles.preview}>
              {
                <a
                  className={styles.image}
                  href={screenshot.url}
                  target="_blank"
                  style={previewImageStyle}
                  aria-label={TEXTS.LABEL_FORM_CAPTURE_PREVIEW_LABEL_TEXT}
                >
                  <Icon className={styles.icon} icon={IconName.Expand} />
                </a>
              }
            </div>
          )
        }
      </div>
      {/* image */}
      {
        label && !isScreenshotEnabled && (
          <div className={styles.inputField}>
            <TextInput
              className={styles.textInput}
              disabled={loading}
              label={TEXTS.LABEL_FORM_FIELD_LABEL_IMAGE}
              placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_IMAGE}
              name="image"
              value={formData.image || ''}
              error={inputErrors.image}
              onChange={handleInputChange}
            />
          </div>
        )
      }
    </form>
  );
};

LabelForm.displayName = 'LabelForm';

export default LabelForm;
