export type Styles = {
  'close': string;
  'header': string;
  'title': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
