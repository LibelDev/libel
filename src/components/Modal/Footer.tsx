import classNames from 'classnames';
import type React from 'react';
import styles from './Footer.module.scss';

interface IProps { }

type TComponentProps = React.ComponentPropsWithoutRef<'div'>;

type TProps = IProps & TComponentProps;

const Footer: React.FunctionComponent<TProps> = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={
        classNames(
          className,
          styles.footer
        )
      }
    />
  );
};

Footer.displayName = 'Footer';

export default Footer;
