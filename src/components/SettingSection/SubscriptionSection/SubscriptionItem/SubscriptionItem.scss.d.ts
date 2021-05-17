export type Styles = {
  'bar': string;
  'iconButton': string;
  'name': string;
  'subscription': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
