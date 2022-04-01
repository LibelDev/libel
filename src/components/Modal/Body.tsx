import classNames from 'classnames';
import React, { useContext } from 'react';
import styles from './Body.module.scss';
import IDsContext from './IDsContext';

interface IProps {
  compact?: boolean;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Body: React.FunctionComponent<TProps> = (props) => {
  const { className, compact = false, children, ...otherProps } = props;
  const { body: id } = useContext(IDsContext);
  return (
    <div
      {...otherProps}
      id={id}
      className={
        classNames(
          className,
          styles.body,
          {
            [styles.compact]: compact
          }
        )
      }
    >
      {children}
    </div>
  );
};

export default Body;
