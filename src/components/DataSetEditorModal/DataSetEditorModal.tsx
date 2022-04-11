// import debugFactory from 'debug';
import React, { useId } from 'react';
import * as TEXTS from '../../constants/texts';
import Button from '../Button/Button';
import DataSetEditor, { TProps as TDataSetEditorProps } from '../DataSetEditor/DataSetEditor';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import styles from './DataSetEditorModal.module.scss';

interface IProps { }

type TProps = IProps & Omit<TModalProps, 'onChange' | 'onSubmit'> & TDataSetEditorProps;

// const debug = debugFactory('libel:component:DataSetEditorModal');

const DataSetEditorModal: React.FunctionComponent<TProps> = (props) => {
  const { id, dataSet, onChange, onSubmit, onClose, ...otherProps } = props;

  const _formId = id || useId();

  const users = Object.keys(dataSet.data);
  const empty = users.length === 0;

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header onClose={onClose}>
        {TEXTS.DATA_SET_EDITOR_MODAL_TITLE}
      </Modal.Header>
      <Modal.Body className={styles.body}>
        <DataSetEditor
          id={_formId}
          className={styles.dataSetEditor}
          dataSet={dataSet}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </Modal.Body>
      {
        !empty && (
          <Modal.Footer>
            <Button form={_formId} type="submit">
              {TEXTS.DATA_SET_EDITOR_BUTTON_TEXT_SAVE}
            </Button>
          </Modal.Footer>
        )
      }
    </Modal>
  );
};

DataSetEditorModal.displayName = 'DataSetEditorModal';

export default DataSetEditorModal;
