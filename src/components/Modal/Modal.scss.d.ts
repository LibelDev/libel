export type Styles = {
  'backdrop': string;
  'inner': string;
  'modal': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
