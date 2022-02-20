import classNames from 'classnames';
import React from 'react';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.scss';

export enum Variant {
  Warning = 'settingOptionButtonWarn'
}

interface IProps {
  variant?: Variant;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

const SettingOptionButton: React.FunctionComponent<TProps> = (props) => {
  const { variant, className, ...otherProps } = props;
  return (
    <a
      href="#"
      role="button"
      className={
        classNames(
          className,
          lihkgCssClasses.settingOptionButton,
          variant && lihkgCssClasses[variant]
        )
      }
      {...otherProps}
    />
  );
};

export default SettingOptionButton;
