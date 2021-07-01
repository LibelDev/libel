export type Styles = {
  'nav': string;
  'navCategory': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
