import React, { useMemo } from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import { selectPersonal } from '../../store/selectors';
import { useTypedSelector } from '../../store/store';
import Button from '../Button/Button';
import DataSetEditor, { TProps as TDataSetEditorProps } from '../DataSetEditor/DataSetEditor';
import Modal, { TProps as TModalProps } from '../Modal/Modal';
import styles from './DataSetEditorModal.module.scss';

interface IProps { }

type TProps = IProps & TModalProps & TDataSetEditorProps;

const DataSetEditorModal: React.FunctionComponent<TProps> = (props) => {
  const { onClose, dataSet, ...otherProps } = props;

  const personal = useTypedSelector(selectPersonal);
  const { labels } = useMemo(() => personal.aggregate(), [personal]);
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
            <DataSetEditor id={formID} dataSet={dataSet} />
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
              {TEXTS.DATA_SET_EDITOR_SUBMIT_BUTTON_TEXT}
            </Button>
          </Modal.Footer>
        )
      }
    </Modal>
  );
};

DataSetEditorModal.displayName = 'DataSetEditorModal';

export default DataSetEditorModal;
