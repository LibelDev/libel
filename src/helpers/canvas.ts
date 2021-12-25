import html2canvas, { Options } from 'html2canvas';

const toBlob = async (element: HTMLElement, options?: Partial<Options>) => {
  const _options = {
    allowTaint: true,
    useCORS: true,
    ...options
  };
  const canvas = await html2canvas(element, _options);
  return new Promise<[Blob | null, HTMLCanvasElement]>((resolve) => {
    canvas.toBlob((blob) => {
      resolve([blob, canvas]);
    });
  });
};

export const toImageURL = async (element: HTMLElement, options?: Partial<Options>): Promise<[string | null, Blob | null, HTMLCanvasElement]> => {
  const [blob, canvas] = await toBlob(element, options)!;
  if (blob) {
    const url = URL.createObjectURL(blob);
    return [url, blob, canvas];
  }
  return [null, blob, canvas];
};
