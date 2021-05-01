export type Styles = {
  'buttons': string;
  'info': string;
  'name': string;
  'reload': string;
  'remove': string;
  'sectionTitle': string;
  'subscription': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
