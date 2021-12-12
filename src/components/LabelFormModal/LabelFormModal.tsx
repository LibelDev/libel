import React from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import LabelForm, { IProps as ILabelFormProps } from '../LabelForm/LabelForm';
import Modal, { Body, Footer, Header, IProps as IModalProps } from '../Modal/Modal';

type TProps = IModalProps & ILabelFormProps & {};

const LabelFormModal: React.FunctionComponent<TProps> = (props) => {
  const { id, onClose, user, data, loading, onSubmission, ...otherProps } = props;

  const _id = id || useElementID(LabelFormModal.displayName!);

  return (
    <Modal onClose={onClose} {...otherProps}>
      <Header onClose={onClose}>
        {
          data ?
            TEXTS.LABEL_FORM_MODAL_TITLE_EDIT :
            TEXTS.LABEL_FORM_MODAL_TITLE_ADD
        }
      </Header>
      <Body>
        <LabelForm
          id={_id}
          user={user}
          data={data}
          loading={loading}
          onSubmission={onSubmission}
        />
      </Body>
      <Footer>
        <Button
          form={_id}
          type="submit"
          loading={loading}
        >
          {TEXTS.LABEL_FORM_BUTTON_SUBMIT}
        </Button>
      </Footer>
    </Modal>
  );
};

LabelFormModal.displayName = 'LabelFormModal';

export default LabelFormModal;

export { ILabelFormProps };
