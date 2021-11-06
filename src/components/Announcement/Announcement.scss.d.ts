export type Styles = {
  'announcement': string;
  'container': string;
  'logo': string;
  'message': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
