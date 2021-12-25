import classNames from 'classnames';
import joi from 'joi';
import React, { useCallback, useMemo, useState } from 'react';
import cache from '../../cache';
import { HEX_COLOR } from '../../constants/regexes';
import * as TEXTS from '../../constants/texts';
import { MappedHTMLAttributes } from '../../helpers/types';
import useElementID from '../../hooks/useElementID';
import useScreenshot from '../../hooks/useScreenshot';
import Label, { ILabel } from '../../models/Label';
import { IconName } from '../../types/icon';
import ColorPicker from '../ColorPicker/ColorPicker';
import Icon from '../Icon/Icon';
import LabelItem from '../LabelList/LabelItems/LabelItem/LabelItem';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './LabelForm.scss';

type TData = Pick<ILabel, 'text' | 'reason' | 'color' | 'image'>;

type TFormData = TData & {
  meta: {
    screenshot?: Blob | null;
  };
};

interface IToggleButtonState {
  isCustomColor: boolean;
  isCaptureReply: boolean;
}

interface IErrors {
  [name: string]: string | undefined;
}

interface IProps {
  /**
   * the target user ID
   */
  user: string;
  /**
   * the label to be edited
   */
  data?: TData;
  loading?: boolean;
  /**
   * custom onSubmit event handler
   * @async
   * @throws {string} error message
   */
  onSubmission: (event: React.FormEvent<HTMLFormElement>, data: TFormData) => Promise<void>;
}

export type TProps = IProps & MappedHTMLAttributes<'form'>;

const schema = joi.object({
  text: joi.string().trim().required().messages({
    'any.required': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_EMPTY,
    'string.empty': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_EMPTY
  }),
  reason: joi.string().trim().allow(''),
  color: joi.string().trim().pattern(HEX_COLOR).allow(''),
  image: joi.string().trim().allow(''),
  meta: joi.object({
    screenshot: joi.any()
  })
}).unknown();

const initialFormData: TFormData = {
  text: '',
  meta: {}
};

const LabelForm: React.FunctionComponent<TProps> = (props) => {
  const {
    id,
    className,
    user,
    data,
    loading,
    onSubmission,
    ...otherProps
  } = props;

  const [formData, setFormData] = useState<TFormData>(data as TFormData || initialFormData);
  const [toggleButtonState, setToggleButtonState] = useState<IToggleButtonState>({
    isCustomColor: !!formData.color,
    isCaptureReply: false
  });
  const [errors, setErrors] = useState<IErrors>({});
  const [error, setError] = useState('');

  const draftLabel = useMemo(() => {
    const { text } = formData;
    const label = new Label(text || TEXTS.LABEL_FORM_LABEL_PREVIEW_LABEL_DUMMY_TEXT);
    return label;
  }, [formData]);

  const screenshot = useScreenshot(toggleButtonState.isCaptureReply ? cache.targetReply : null, useMemo(() => ({
    onclone: (document, element) => {
      element.style.width = '600px';
    }
  }), []));

  const _id = id || useElementID(LabelForm.displayName!);
  const errorID = `${_id}-error`;

  const _user = cache.getUser(user);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }, [formData, errors]);

  const handleToggleButtonChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked, name } = event.target;
    setToggleButtonState({ ...toggleButtonState, [name]: checked });
  }, [toggleButtonState]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    const _formData: TFormData = {
      ...formData,
      color: toggleButtonState.isCustomColor ? formData.color : undefined, // unset if it is disabled
      meta: {
        ...formData.meta,
        screenshot: screenshot.blob
      }
    };
    const { value, error } = schema.validate(_formData);
    if (error) {
      const { details } = error;
      for (const { context, message } of details) {
        const { key } = context!;
        const _errors = { ...errors, [key!]: message };
        setErrors(_errors);
      }
    } else {
      try {
        await onSubmission(event, value);
      } catch (err) {
        if (typeof err === 'string') {
          setError(err);
        }
      }
    }
  }, [onSubmission, formData, toggleButtonState, errors, screenshot]);

  return (
    <form
      id={_id}
      className={classNames(className, styles.labelForm)}
      {...otherProps}
      onSubmit={handleSubmit}
      aria-describedby={errorID}
    >
      {
        _user && (
          <div>
            <Icon className={styles.userIcon} icon={IconName.Account} />
            {_user.nickname}
          </div>
        )
      }
      <div className={styles.inputField}>
        <TextInput
          className={styles.input}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_TEXT}
          name="text"
          value={formData.text || ''}
          error={errors.text}
          onChange={handleInputChange}
          autoFocus
        />
      </div>
      <div className={styles.inputField}>
        <TextInput
          className={styles.input}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_REASON}
          placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_REASON}
          name="reason"
          value={formData.reason || ''}
          error={errors.reason}
          onChange={handleInputChange}
        />
      </div>
      <div className={classNames(styles.inputField, styles.color)}>
        <ToggleButton
          className={styles.toggleButton}
          checked={toggleButtonState.isCustomColor}
          name="isCustomColor"
          disabled={loading}
          onChange={handleToggleButtonChange}
        >
          {TEXTS.LABEL_FORM_FIELD_LABEL_CUSTOM_COLOR}
        </ToggleButton>
        {
          toggleButtonState.isCustomColor && (
            <div className={styles.colorPicker}>
              <span className={styles.preview}>
                {TEXTS.LABEL_FORM_LABEL_PREVIEW_LABEL_LABEL_TEXT}
                {
                  draftLabel.text && (
                    <LabelItem
                      className={styles.labelItem}
                      label={draftLabel}
                      color={formData.color}
                      hasInfo={false}
                    />

                  )
                }
              </span>
              <ColorPicker
                className={styles.input}
                disabled={loading}
                name="color"
                value={formData.color || ''}
                error={errors.color}
                onChange={handleInputChange}
              />
            </div>
          )
        }
      </div>
      {
        data ? (
          /** edit label */
          <div className={styles.inputField}>
            <TextInput
              className={styles.input}
              disabled={loading}
              label={TEXTS.LABEL_FORM_FIELD_LABEL_IMAGE}
              placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_IMAGE}
              name="image"
              value={formData.image || ''}
              error={errors.image}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          /** add label */
          <div className={classNames(styles.inputField, styles.screenshot)}>
            <ToggleButton
              className={styles.toggleButton}
              checked={toggleButtonState.isCaptureReply}
              disabled={loading}
              name="isCaptureReply"
              loading={screenshot.loading}
              onChange={handleToggleButtonChange}
            >
              {TEXTS.LABEL_FORM_FIELD_LABEL_CAPTURE}
            </ToggleButton>
            {
              !screenshot.loading && (screenshot.error || screenshot.url) && (
                <div className={styles.preview}>
                  {
                    screenshot.error ? (
                      <span className={styles.error}>
                        <Icon className={styles.icon} icon={IconName.CommentAlert} />
                        {TEXTS.LABEL_FORM_CAPTURE_ERROR}
                      </span>
                    ) : (
                      screenshot.url && (
                        <a
                          className={styles.image}
                          href={screenshot.url}
                          target="_blank"
                          style={{ backgroundImage: `url(${screenshot.url})` }}
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
        !!error && (
          <div id={errorID} className={styles.error}>
            <Icon className={styles.icon} icon={IconName.CommentAlert} />
            {error}
          </div>
        )
      }
    </form>
  );
};

LabelForm.displayName = 'LabelForm';

export default LabelForm;
