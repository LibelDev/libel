// import debugFactory from 'debug';
import React from 'react';
import * as TEXTS from '../../constants/texts';
import useElementID from '../../hooks/useElementID';
import Button from '../Button/Button';
import DataSetEditor, { TProps as TDataSetEditorProps } from '../DataSetEditor/DataSetEditor';
import Modal, { TProps as TModalProps } from '../Modal/Modal';

interface IProps { }

type TProps = IProps & Omit<TModalProps, 'onChange' | 'onSubmit'> & TDataSetEditorProps;

// const debug = debugFactory('libel:component:DataSetEditorModal');

const DataSetEditorModal: React.FunctionComponent<TProps> = (props) => {
  const { id, dataSet, onChange, onSubmit, onClose, ...otherProps } = props;

  const formID = useElementID(DataSetEditor.displayName!);

  const users = Object.keys(dataSet.data);
  const empty = users.length === 0;

  return (
    <Modal {...otherProps} onClose={onClose}>
      <Modal.Header border={empty} onClose={onClose}>
        {TEXTS.DATA_SET_EDITOR_MODAL_TITLE}
      </Modal.Header>
      <Modal.Body padding={empty}>
        {
          !empty ? (
            <DataSetEditor
              id={formID}
              dataSet={dataSet}
              onChange={onChange}
              onSubmit={onSubmit}
            />
          ) : (
            TEXTS.DATA_SET_EDITOR_MESSAGE_EMPTY_DATA_SET
          )
        }
      </Modal.Body>
      {
        !empty && (
          <Modal.Footer>
            <Button form={formID} type="submit">
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
