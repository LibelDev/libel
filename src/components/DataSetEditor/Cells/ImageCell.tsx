// import debugFactory from 'debug';
import React from 'react';
import * as TEXTS from '../../../constants/texts';

interface IProps {
  src?: string | null;
}

type TProps = IProps & React.ComponentPropsWithoutRef<'a'>;

// const debug = debugFactory('libel:component:ImageCell');

const ImageCell: React.FunctionComponent<TProps> = (props) => {
  const { src, ...otherProps } = props;

  if (!src) {
    return null;
  }

  return (
    <a {...otherProps} href={src} target='_blank'>
      {TEXTS.SPREADSHEET_COLUMN_HEADER_LABEL_IMAGE}
    </a>
  );
};


export default ImageCell;
