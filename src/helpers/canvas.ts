import html2canvas, { Options } from 'html2canvas';

export const toBlob = async (element: HTMLElement, options?: Partial<Options>) => {
  const _options = {
    allowTaint: true,
    useCORS: true,
    ...options
  };
  const canvas = await html2canvas(element, _options);
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve);
  });
};

// export const toImageURL = async (element: HTMLElement, options?: Partial<Options>) => {
//   const blob = await toBlob(element, options);
//   return URL.createObjectURL(blob);
// };
