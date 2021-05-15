import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { prompt } from '../../helpers/label';
import { actions as personalActions } from '../../store/slices/personal';
import { IPost } from '../../types/post';
import styles from './AddLabelButton.scss';

interface IProps {
  user: string;
  source?: IPost;
}

const AddLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { user, source } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback((event) => {
    event.preventDefault();
    const data = prompt();
    if (data) {
      const { text, reason } = data;
      dispatch(personalActions.add({ user, text, reason, source }));
    }
  }, [user, source]);

  return (
    <a className={styles.addLabelButton} href="#" onClick={handleClick}>
      {props.children}
    </a>
  );
};

export default AddLabelButton;
