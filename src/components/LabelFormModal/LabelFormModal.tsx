import type React from 'react';
import { useId } from 'react';
import * as TEXTS from '../../constants/texts';
import Button from '../Button/Button';
import LabelForm, { IProps as ILabelFormProps, TProps as TLabelFormProps } from '../LabelForm/LabelForm';
import Modal, { TProps as TModalProps } from '../Modal/Modal';

interface IProps { }

type TComponentProps = Omit<TModalProps, keyof ILabelFormProps>;

type TProps = IProps & TComponentProps & TLabelFormProps;

const LabelFormModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, user, label, loading, targetReply, onSubmit, ...otherProps } = props;

  const _formId = useId();

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header>
        {
          label ?
            TEXTS.LABEL_FORM_MODAL_TITLE_EDIT_LABEL :
            TEXTS.LABEL_FORM_MODAL_TITLE_ADD_LABEL
        }
      </Modal.Header>
      <Modal.Body>
        <LabelForm
          id={_formId}
          user={user}
          label={label}
          loading={loading}
          targetReply={targetReply}
          onSubmit={onSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          form={_formId}
          type="submit"
          loading={loading}
        >
          {TEXTS.BUTTON_TEXT_LABEL_FORM_SUBMIT}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LabelFormModal.displayName = 'LabelFormModal';

export default LabelFormModal;

export { TLabelFormProps };
