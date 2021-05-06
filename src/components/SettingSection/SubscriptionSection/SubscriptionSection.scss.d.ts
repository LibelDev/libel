export type Styles = {
  'name': string;
  'sectionTitle': string;
  'subscription': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
