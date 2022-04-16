import classNames from 'classnames';
import type React from 'react';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import styles from './SettingOptionButton.module.scss';

export enum Variant {
  Warning = 'settingOptionButtonWarn'
}

interface IProps {
  disabled?: boolean;
  variant?: Variant;
}

type TComponentProps = React.ComponentPropsWithoutRef<'a'>;

type TProps = IProps & TComponentProps;

const SettingOptionButton: React.FunctionComponent<TProps> = (props) => {
  const { disabled, variant, className, onClick, ...otherProps } = props;
  return (
    <a
      {...otherProps}
      href="#"
      role="button"
      className={
        classNames(
          className,
          lihkgCssClasses.settingOptionButton,
          variant && lihkgCssClasses[variant],
          styles.settingOptionButton,
          {
            [styles.disabled]: disabled
          }
        )
      }
      onClick={!disabled ? onClick : undefined}
    />
  );
};

SettingOptionButton.displayName = 'SettingOptionButton';

export default SettingOptionButton;
