export type Styles = {
  'error': string;
  'icon': string;
  'inputField': string;
  'labelForm': string;
  'screenshot': string;
  'textInput': string;
  'userIcon': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
