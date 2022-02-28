// import debugFactory from 'debug';
import React, { useMemo } from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import DataSetEditor, { TProps as TDataSetEditorProps } from '../DataSetEditor/DataSetEditor';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import styles from './DataSetEditorModal.module.scss';

interface IProps { }

type TProps = IProps & TModalProps & TDataSetEditorProps;

// const debug = debugFactory('libel:component:DataSetEditorModal');

const DataSetEditorModal: React.FunctionComponent<TProps> = (props) => {
  const { dataSet, onSave, onClose, ...otherProps } = props;

  const { labels } = useMemo(() => dataSet.aggregate(), [dataSet]);
  const formID = useElementID(DataSetEditor.displayName!);

  const empty = labels.length === 0;

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header border={empty} onClose={onClose}>
        {TEXTS.DATA_SET_EDITOR_MODAL_TITLE}
      </Modal.Header>
      <Modal.Body>
        {
          !empty ? (
            <DataSetEditor id={formID} dataSet={dataSet} onSave={onSave} />
          ) : (
            <div className={styles.emptyDataSetMesssage}>
              {TEXTS.DATA_SET_EDITOR_EMPTY_DATA_SET_MESSAGE}
            </div>
          )
        }
      </Modal.Body>
      {
        !empty && (
          <Modal.Footer>
            <Button form={formID} type="submit">
              {TEXTS.DATA_SET_EDITOR_SAVE_BUTTON_TEXT}
            </Button>
          </Modal.Footer>
        )
      }
    </Modal>
  );
};

DataSetEditorModal.displayName = 'DataSetEditorModal';

export default DataSetEditorModal;
