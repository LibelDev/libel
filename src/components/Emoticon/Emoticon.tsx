import React from 'react';
import useEmoticon from '../../hooks/useEmoticon';

/**
 * original props
 */
interface IProps {
  code: string;
}

/**
 * component props
 */
type TComponentProps = TComponentPropsWithoutRef<'img', IProps>;

/**
 * `Emoticon` props
 */
export type TProps = IProps & TComponentProps;

const Emoticon: React.FunctionComponent<TProps> = (props) => {
  const { className, code, ...otherProps } = props;
  const src = useEmoticon(code);

  if (!src) {
    return <>{code}</>;
  }

  return (
    <img
      className={className}
      src={src}
      alt={code}
      {...otherProps}
    />
  );
};

Emoticon.displayName = 'Emoticon';

export default Emoticon;
