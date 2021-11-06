export type Styles = {
  'app': string;
  'leftPanel': string;
  'nav': string;
  'navCategory': string;
  'notice': string;
  'rightPanel': string;
  'splitView': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
