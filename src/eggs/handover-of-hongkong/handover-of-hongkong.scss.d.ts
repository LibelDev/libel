export type Styles = {
  'egg': string;
  'underlay': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
