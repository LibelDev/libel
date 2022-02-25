// import debugFactory from 'debug';
import React from 'react';
import * as TEXTS from '../../../constants/texts';

interface IProps { }

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

// const debug = debugFactory('libel:component:SourceCell');

const SourceCell: React.FunctionComponent<TProps> = (props) => {
  const { href, ...otherProps } = props;
  return (
    <a {...otherProps} href={href} target='_blank'>
      {TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_SOURCE}
    </a>
  );
};


export default SourceCell;
