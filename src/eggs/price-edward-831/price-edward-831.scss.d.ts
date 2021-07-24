export type Styles = {
  'active': string;
  'egg': string;
  'image': string;
  'slideshow': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
