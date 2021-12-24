export type Styles = {
  'error': string;
  'expand': string;
  'icon': string;
  'inputField': string;
  'labelForm': string;
  'loadingSpinner': string;
  'screenshotPreview': string;
  'screenshotToggleButton': string;
  'textInput': string;
  'userIcon': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
