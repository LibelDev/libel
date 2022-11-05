import html2canvas, { Options } from 'html2canvas';
import max from 'lodash/max';

export const toCanvas = (element: HTMLElement, options?: Partial<Options>) => {
  const _options = {
    allowTaint: true,
    useCORS: false,
    ...options
  };
  return html2canvas(element, _options);
};

const toBlob = async (canvas: HTMLCanvasElement) => {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve);
  });
};

export const toImageURL = async (canvas: HTMLCanvasElement): Promise<[string | null, Blob | null]> => {
  const blob = await toBlob(canvas)!;
  const url = blob && URL.createObjectURL(blob);
  return [url, blob];
};

/**
 * merge two canvases vertically
 */
export const mergeCanvas = (canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const { width: width1, height: height1 } = canvas1;
  const { width: width2, height: height2 } = canvas2;
  canvas.width = max([width1, width2])!;
  canvas.height = height1 + height2;
  context.drawImage(canvas1, 0, 0);
  context.drawImage(canvas2, 0, height1, width2, height2);
  return canvas;
};
