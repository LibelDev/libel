import React from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import LabelForm, { TProps as TLabelFormProps } from '../LabelForm/LabelForm';
import Modal, { TProps as TModalProps } from '../Modal/Modal';

interface IProps { }

type TProps = IProps & Omit<TModalProps, 'onSubmit'> & TLabelFormProps;

const LabelFormModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, user, label, loading, onSubmit, ...otherProps } = props;

  const formID = useElementID(LabelForm.displayName!);

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header onClose={onClose}>
        {
          label ?
            TEXTS.LABEL_FORM_MODAL_TITLE_EDIT_LABEL :
            TEXTS.LABEL_FORM_MODAL_TITLE_ADD_LABEL
        }
      </Modal.Header>
      <Modal.Body>
        <LabelForm
          id={formID}
          user={user}
          label={label}
          loading={loading}
          onSubmit={onSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          form={formID}
          type="submit"
          loading={loading}
        >
          {TEXTS.LABEL_FORM_BUTTON_TEXT_SUBMIT}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LabelFormModal.displayName = 'LabelFormModal';

export default LabelFormModal;

export { TLabelFormProps };
