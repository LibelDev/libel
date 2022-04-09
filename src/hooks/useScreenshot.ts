import { useEffect, useState } from 'react';
import { toCanvas, toImageURL, TToCanvasOptions } from '../helpers/canvas';

export interface IResult {
  loading: boolean;
  error: unknown | null;
  url: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
}

const initialResult: IResult = {
  loading: false,
  error: null,
  url: null,
  blob: null,
  canvas: null
};

const useScreenshot = <E extends HTMLElement> (enabled: boolean, element?: E, options?: TToCanvasOptions): IResult => {
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

export type { TToCanvasOptions as TOptions };
