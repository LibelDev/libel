import React from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import SubscriptionMaker, { TProps as TSubscriptionMakerProps } from '../SubscriptionMaker/SubscriptionMaker';

interface IProps { }

type TProps = IProps & Omit<TModalProps, 'onSubmit'> & TSubscriptionMakerProps;

const SubscriptionMakerModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, dataSet, onSubmit, ...otherProps } = props;

  const formID = useElementID(SubscriptionMaker.displayName!);

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header onClose={onClose}>
        {TEXTS.SUBSCRIPTION_MAKER_MODAL_TITLE}
      </Modal.Header>
      <Modal.Body>
        <SubscriptionMaker
          id={formID}
          dataSet={dataSet}
          onSubmit={onSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button form={formID} type="submit">
          {TEXTS.SUBSCRIPTION_MAKER_BUTTON_TEXT_SUBMIT}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SubscriptionMakerModal.displayName = 'SubscriptionMakerModal';

export default SubscriptionMakerModal;
