import { useEffect, useState } from 'react';
import { mergeCanvas, toCanvas, toImageURL } from '../helpers/canvas';

type TToCanvasOptions = NonNullable<Parameters<typeof toCanvas>[1]>;

export namespace UseScreenshot {
  /**
   * `useScreenshot` hook options, it needs to be memoized
   */
  export type TOptions = TToCanvasOptions;
  /**
   * `useScreenshot` hook result
   */
  export interface IResult {
    loading: boolean;
    error: unknown | null;
    url: string | null;
    blob: Blob | null;
    canvas: HTMLCanvasElement | null;
  }
}

const initialResult: UseScreenshot.IResult = {
  loading: false,
  error: null,
  url: null,
  blob: null,
  canvas: null
};

const useScreenshot = <E extends HTMLElement> (enabled: boolean, elements?: E[], options?: UseScreenshot.TOptions): UseScreenshot.IResult => {
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    (async () => {
      if (enabled && elements && elements.length) {
        setResult({ ...initialResult, loading: true });
        try {
          const promises = elements.map((element) => toCanvas(element, options));
          const canvases = await Promise.all(promises);
          const canvas = mergeCanvas(canvases[0], canvases[1]);
          const [url, blob] = await toImageURL(canvas);
          setResult({ loading: false, error: null, url, blob, canvas });
        } catch (err) {
          setResult({ ...initialResult, error: err });
        }
      } else {
        setResult(initialResult);
      }
    })();
  }, [enabled, elements, options]);

  return result;
};

export default useScreenshot;
