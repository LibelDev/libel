import classNames from 'classnames';
import joi from 'joi';
import type React from 'react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { namespace } from '../../../package.json';
import cache from '../../cache';
import * as TEXTS from '../../constants/texts';
import * as gtag from '../../helpers/gtag';
import * as LIHKG from '../../helpers/lihkg';
import { mapValidationError } from '../../helpers/validation';
import useLabelSourcePost from '../../hooks/useLabelSourcePost';
import useSourcePostScreenshot from '../../hooks/useSourcePostScreenshot';
import type { ILabel } from '../../models/Label';
import { color, image, reason, text } from '../../schemas/label';
import { EventAction, EventCategory } from '../../types/ga';
import ColorPicker from '../ColorPicker/ColorPicker';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import LabelImageButton from '../LabelImageButton/LabelImageButton';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './LabelForm.module.scss';

type TLabelData = Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>;

export type TFormData = TLabelData & {
  meta: {
    screenshot?: ReturnType<typeof useSourcePostScreenshot>[0];
  };
};

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

const LabelForm: React.FunctionComponent<TProps> = (props) => {
  const { id, className, user, label, loading, onSubmit, ...otherProps } = props;

  const [formData, setFormData] = useState<TFormData>(label as TFormData || initialFormData);
  const [isColorEnabled, setIsColorEnabled] = useState(!!formData.color);
  const [isScreenshotEnabled, setIsScreenshotEnabled] = useState(false);
  const [inputErrors, setInputErrors] = useState<IInputErrors>({});

  const post = useLabelSourcePost();
  const [screenshot, capture] = useSourcePostScreenshot(post);

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

  const handleColorToggleButtonChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked } = event.target;
    setIsColorEnabled(checked);
  }, []);

  const handleScreenshotToggleButtonChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (event) => {
    const { checked } = event.target;
    setIsScreenshotEnabled(checked);
    await capture(checked);
  }, [capture]);

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
      const notification = LIHKG.createLocalNotification(TEXTS.LABEL_FORM_SCREENSHOT_ERROR);
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
          disabled={loading}
          onChange={handleColorToggleButtonChange}
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
          loading={screenshot.loading}
          onChange={handleScreenshotToggleButtonChange}
        >
          {TEXTS.LABEL_FORM_FIELD_LABEL_SCREENSHOT}
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
                  aria-label={TEXTS.LABEL_FORM_SCREENSHOT_PREVIEW_LABEL_TEXT}
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
          <div className={classNames(styles.inputField, styles.image)}>
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
            <LabelImageButton
              className={styles.imageButton}
              label={label}
            />
          </div>
        )
      }
    </form>
  );
};

LabelForm.displayName = 'LabelForm';

export default LabelForm;
