import html2canvas, { Options } from 'html2canvas';

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
