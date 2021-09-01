export type Styles = {
  'footer': string;
  'version': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
