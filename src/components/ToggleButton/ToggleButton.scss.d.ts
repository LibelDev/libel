export type Styles = {
  'button': string;
  'checked': string;
  'disabled': string;
  'simple': string;
  'toggleButton': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
