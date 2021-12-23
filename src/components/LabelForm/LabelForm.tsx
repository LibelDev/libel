import classNames from 'classnames';
import joi from 'joi';
import React, { useCallback, useState } from 'react';
import cache from '../../cache';
import * as TEXTS from '../../constants/texts';
import { MappedHTMLAttributes } from '../../helpers/types';
import useElementID from '../../hooks/useElementID';
import { ILabel } from '../../models/Label';
import schema from '../../schemas/label';
import { IconName } from '../../types/icon';
import Icon from '../Icon/Icon';
import TextInput from '../TextInput/TextInput';
import ToggleButton from '../ToggleButton/ToggleButton';
import styles from './LabelForm.scss';

interface IErrors {
  [name: string]: string | undefined;
}

type TLabelFormData = (
  Required<Pick<ILabel, 'text' | 'reason'>> &
  Pick<ILabel, 'image'>
);

interface IProps {
  /**
   * the target user ID
   */
  user: string;
  /**
   * the label to be edited
   */
  data?: ILabel;
  loading?: boolean;
  /**
   * custom onSubmit event handler
   * @async
   * @throws {string} error message
   */
  onSubmission: (event: React.FormEvent<HTMLFormElement>, label: TLabelFormData, capture?: boolean) => Promise<void>;
}

export type TProps = IProps & MappedHTMLAttributes<'form'>;

const _schema = schema.keys({
  text: joi.string().trim().required().messages({
    'any.required': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_EMPTY,
    'string.empty': TEXTS.LABEL_FORM_FIELD_ERROR_TEXT_EMPTY
  }),
});

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

  const [formData, setFormData] = useState<TLabelFormData>(data as TLabelFormData || {
    text: '',
    reason: ''
  });
  const [capture, setCapture] = useState(false); // capture the screenshot of the target reply
  const [errors, setErrors] = useState<IErrors>({});
  const [error, setError] = useState('');

  const _id = id || useElementID(LabelForm.displayName!);
  const errorID = `${_id}-error`;

  const _user = cache.getUser(user);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { name, value } = event.target;
    const _formData = { ...formData, [name]: value };
    setFormData(_formData);
    const _errors = { ...errors, [name]: undefined };
    setErrors(_errors);
  }, [formData, errors]);

  const handleCaptureChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const { checked } = event.target;
    setCapture(checked);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    // const form = new FormData(event.target as HTMLFormElement);
    // const data = Object.fromEntries(form as any);
    const { value, error } = _schema.validate(formData);
    if (error) {
      const { details } = error;
      for (const { context, message } of details) {
        const { key } = context!;
        const _errors = { ...errors, [key!]: message };
        setErrors(_errors);
      }
    } else {
      try {
        await onSubmission(event, value as TLabelFormData, capture);
      } catch (err) {
        if (typeof err === 'string') {
          setError(err);
        }
      }
    }
  }, [onSubmission, capture, errors]);

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
          className={styles.textInput}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_TEXT}
          name='text'
          value={formData.text || ''}
          error={errors.text}
          onChange={handleChange}
          autoFocus
        />
      </div>
      <div className={styles.inputField}>
        <TextInput
          className={styles.textInput}
          disabled={loading}
          label={TEXTS.LABEL_FORM_FIELD_LABEL_REASON}
          placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_REASON}
          name='reason'
          value={formData.reason || ''}
          error={errors.reason}
          onChange={handleChange}
        />
      </div>
      {
        data ? (
          /** edit label */
          <div className={styles.inputField}>
            <TextInput
              className={styles.textInput}
              disabled={loading}
              label={TEXTS.LABEL_FORM_FIELD_LABEL_IMAGE}
              placeholder={TEXTS.LABEL_FORM_FIELD_PLACEHOLDER_IMAGE}
              name='image'
              value={formData.image || ''}
              error={errors.image}
              onChange={handleChange}
            />
          </div>
        ) : (
          /** add label */
          <div className={styles.inputField}>
            <ToggleButton
              className={styles.screenshot}
              checked={capture}
              disabled={loading}
              onChange={handleCaptureChange}
            >
              {TEXTS.LABEL_FORM_FIELD_LABEL_CAPTURE}
            </ToggleButton>
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
