import React from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import LabelForm, { TProps as TLabelFormProps } from '../LabelForm/LabelForm';
import Modal, { Body, Footer, Header, TProps as TModalProps } from '../Modal/Modal';

interface IProps { }

type TProps = IProps & TModalProps & TLabelFormProps;

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

export { TLabelFormProps };
