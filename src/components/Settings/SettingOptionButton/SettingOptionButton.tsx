import classNames from 'classnames';
import type React from 'react';
import lihkgCssClasses from '../../../stylesheets/variables/lihkg/classes.module.scss';
import Button, { type TProps as TButtonProps } from '../../Button/Button';

export enum Variant {
  Warning = 'settingOptionButtonWarn'
}

interface IProps {
  variant?: Variant;
}

type TComponentProps = TComponentPropsWithoutRef<'a', IProps>;

type TProps = IProps & TComponentProps & TButtonProps<'a'>;

/**
 * @extends Button
 */
const SettingOptionButton: React.FunctionComponent<TProps> = (props) => {
  const { disabled, loading, variant, className, onClick, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      as="a"
      href="#"
      role="button"
      className={
        classNames(
          className,
          lihkgCssClasses.settingOptionButton,
          variant && lihkgCssClasses[variant]
        )
      }
      disabled={disabled}
      loading={loading}
      onClick={(!disabled && !loading) ? onClick : undefined}
    />
  );
};

SettingOptionButton.displayName = 'SettingOptionButton';

export default SettingOptionButton;
