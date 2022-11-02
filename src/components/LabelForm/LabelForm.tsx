import classNames from 'classnames';
import joi from 'joi';
import type React from 'react';
import { useCallback, useId, useMemo, useState } from 'react';
import { imageProxyURL } from '../../../config/config';
import { namespace } from '../../../package.json';
import cache from '../../cache';
import { SCREENSHOT_WIDTH } from '../../constants/label';
import * as TEXTS from '../../constants/texts';
import { isMobileMode } from '../../helpers/app';
import * as gtag from '../../helpers/gtag';
import { mapValidationError } from '../../helpers/validation';
import useScreenshot, { UseScreenshot } from '../../hooks/useScreenshot';
import type { ILabel } from '../../models/Label';
import { color, image, reason, text } from '../../schemas/label';
import lihkgSelectors from '../../stylesheets/variables/lihkg/selectors.module.scss';
import { EventAction, EventCategory } from '../../types/ga';
import ColorPicker from '../ColorPicker/ColorPicker';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Icon from '../Icon/Icon';
import { IconName } from '../Icon/types';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './LabelForm.module.scss';

type TLabelData = Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>;

type TFormData = TLabelData & {
  meta: {
    screenshot?: UseScreenshot.IResult;
  };
};

interface IToggleButtonState {
  useCustomColor: boolean;
  useScreenshot: boolean;
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
   * the target reply element for screenshot
   */
  targetReply?: HTMLElement;
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
  const { id, className, user, label, loading, targetReply, onSubmit, ...otherProps } = props;

  const [formData, setFormData] = useState<TFormData>(label as TFormData || initialFormData);
  const [toggleButtonState, setToggleButtonState] = useState<IToggleButtonState>({
    useCustomColor: !!formData.color,
    useScreenshot: false
  });
  const [inputErrors, setInputErrors] = useState<IInputErrors>({});
  const [formError, setFormError] = useState('');

  const threadTitleBar = document.querySelector<HTMLDivElement>(lihkgSelectors.threadTitleBar)!;
  const elements = useMemo(() => [threadTitleBar, targetReply!], [threadTitleBar, targetReply]);
  const screenshot = useScreenshot(!!targetReply && toggleButtonState.useScreenshot, elements, useScreenshotOptions);

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
    setToggleButtonState({ ...toggleButtonState, [name]: checked });
  }, [toggleButtonState]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    const _formData: TFormData = {
      ...formData,
      color: toggleButtonState.useCustomColor ? formData.color : undefined, // unset if it is disabled
      meta: { ...formData.meta, screenshot: screenshot }
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
          setFormError(err);
        }
      }
    }
  }, [onSubmit, formData, toggleButtonState, inputErrors, screenshot]);

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
      <div className={classNames(styles.inputField, styles.color)}>
        <ToggleButton
          className={styles.toggleButton}
          checked={toggleButtonState.useCustomColor}
          name="useCustomColor"
          disabled={loading}
          onChange={handleToggleButtonChange}
        >
          {TEXTS.LABEL_FORM_FIELD_LABEL_CUSTOM_COLOR}
          {
            toggleButtonState.useCustomColor && (
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
      {
        label ? (
          /** edit label */
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
        ) : (
          /** add label */
          <div className={classNames(styles.inputField, styles.screenshot)}>
            <ToggleButton
              className={styles.toggleButton}
              checked={toggleButtonState.useScreenshot}
              disabled={loading}
              name="useScreenshot"
              loading={screenshot.loading}
              onChange={handleToggleButtonChange}
            >
              {TEXTS.LABEL_FORM_FIELD_LABEL_CAPTURE}
            </ToggleButton>
            {
              !screenshot.loading && !!(screenshot.error || screenshot.url) && (
                <div className={styles.preview}>
                  {
                    !!screenshot.error ? (
                      <ErrorMessage className={styles.error}>
                        {TEXTS.LABEL_FORM_CAPTURE_ERROR}
                      </ErrorMessage>
                    ) : (
                      screenshot.url && (
                        <a
                          className={styles.image}
                          href={screenshot.url}
                          target="_blank"
                          style={previewImageStyle}
                          aria-label={TEXTS.LABEL_FORM_CAPTURE_PREVIEW_LABEL_TEXT}
                        >
                          <Icon className={styles.icon} icon={IconName.Expand} />
                        </a>
                      )
                    )
                  }
                </div>
              )
            }
          </div>
        )
      }
      {
        !!formError && (
          <ErrorMessage id={_errorId} className={styles.error}>
            {formError}
          </ErrorMessage>
        )
      }
    </form>
  );
};

LabelForm.displayName = 'LabelForm';

export default LabelForm;
