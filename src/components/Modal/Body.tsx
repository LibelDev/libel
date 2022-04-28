import classNames from 'classnames';
import type React from 'react';
import styles from './Body.module.scss';
import useModal from './hooks/useModal';

interface IProps {
  compact?: boolean;
}

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Body: React.FunctionComponent<TProps> = (props) => {
  const { className, compact = false, children, ...otherProps } = props;
  const { ids } = useModal();
  return (
    <div
      {...otherProps}
      id={ids.body}
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

Body.displayName = 'Body';

export default Body;
