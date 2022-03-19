import classNames from 'classnames';
import React, { useContext } from 'react';
import styles from './Body.module.scss';
import IDsContext from './IDsContext';

interface IProps {
  padding?: boolean;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'div'>;

const Body: React.FunctionComponent<TProps> = (props) => {
  const { padding, children } = props;
  const { body: id } = useContext(IDsContext);
  return (
    <div
      id={id}
      className={
        classNames(
          styles.body,
          {
            [styles.padding]: padding
          }
        )
      }
    >
      {children}
    </div>
  );
};

export default Body;
