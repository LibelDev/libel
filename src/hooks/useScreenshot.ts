import { useEffect, useState } from 'react';
import { toCanvas, toImageURL } from '../helpers/canvas';

export namespace UseScreenshot {
  /**
   * `useScreenshot` hook options, it needs to be memoized
   */
  export type TOptions = Parameters<typeof toCanvas>[1];
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

const useScreenshot = <E extends HTMLElement> (enabled: boolean, element?: E, options?: UseScreenshot.TOptions): UseScreenshot.IResult => {
  const [result, setResult] = useState(initialResult);
  useEffect(() => {
    (async () => {
      if (enabled && element) {
        setResult({ ...result, loading: true });
        try {
          const canvas = await toCanvas(element, options);
          const [url, blob] = await toImageURL(canvas);
          setResult({ loading: false, error: null, url, blob, canvas });
        } catch (err) {
          setResult({ ...initialResult, error: err });
        }
      } else {
        setResult(initialResult);
      }
    })();
  }, [enabled, element, options]);
  return result;
};

export default useScreenshot;
