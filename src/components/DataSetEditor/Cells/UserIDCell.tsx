// import debugFactory from 'debug';
import React from 'react';

interface IProps {
  user: string;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

// const debug = debugFactory('libel:component:UserIDCell');

const UserIDCell: React.FunctionComponent<TProps> = (props) => {
  const { user, ...otherProps } = props;
  const href = `/profile/${user}`;
  return (
    <a {...otherProps} href={href} target='_blank'>
      {user}
    </a>
  );
};


export default UserIDCell;
