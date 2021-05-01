export type Styles = {
  'import': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
