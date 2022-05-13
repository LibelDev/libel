import type React from 'react';
import { useId } from 'react';
import * as TEXTS from '../../constants/texts';
import Button from '../Button/Button';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import SubscriptionMaker, { IProps as ISubscriptionMakerProps, TProps as TSubscriptionMakerProps } from '../SubscriptionMaker/SubscriptionMaker';

interface IProps { }

type TComponentProps = Omit<TModalProps, keyof ISubscriptionMakerProps>;

type TProps = IProps & TComponentProps & TSubscriptionMakerProps;

const SubscriptionMakerModal: React.FunctionComponent<TProps> = (props) => {
  const { id, onClose, dataSet, onSubmit, ...otherProps } = props;

  const _formId = id || useId();

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header>
        {TEXTS.SUBSCRIPTION_MAKER_MODAL_TITLE}
      </Modal.Header>
      <Modal.Body>
        <SubscriptionMaker
          id={_formId}
          dataSet={dataSet}
          onSubmit={onSubmit}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button form={_formId} type="submit">
          {TEXTS.BUTTON_TEXT_SUBSCRIPTION_MAKER_SUBMIT}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SubscriptionMakerModal.displayName = 'SubscriptionMakerModal';

export default SubscriptionMakerModal;
