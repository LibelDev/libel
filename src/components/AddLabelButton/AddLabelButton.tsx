import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './AddLabelButton.scss';
import { prompt } from '../../helpers/label';
import { add } from '../../store/slices/personal';
import { IPost } from '../../types/post';

interface IProps {
  user: string;
  source?: IPost;
}

const AddLabelButton: React.FunctionComponent<IProps> = (props) => {
  const dispatch = useDispatch();
  const { user, source } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    const data = prompt();
    if (data) {
      const { text, reason } = data;
      dispatch(add({ user, text, reason, source }));
    }
  };

  return (
    <a className={styles.addLabelButton} href="#" onClick={handleClick}>
      {props.children}
    </a>
  );
};

export default AddLabelButton;
