export type Styles = {
  'blink': string;
  'bottom': string;
  'candle': string;
  'container': string;
  'flame': string;
  'flameUp': string;
  'move': string;
  'moveLeft': string;
  'shadows': string;
  'top': string;
  'wax': string;
  'wick': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
