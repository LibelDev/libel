import { useEffect, useMemo, useState } from 'react';
import { imageProxyURL } from '../../config/config';
import { toCanvas, toImageURL } from '../helpers/canvas';

type TToCanvasOptions = NonNullable<Parameters<typeof toCanvas>[1]>;

export namespace UseScreenshot {
  /**
   * `useScreenshot` hook options, it needs to be memoized
   */
  export type TOptions = TToCanvasOptions & {
    screenshotHeight?: number;
    screenshotWidth?: number;
  };
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

  const { screenshotHeight, screenshotWidth, onclone } = options || {};

  const _options: TToCanvasOptions = useMemo(() => ({
    proxy: imageProxyURL,
    ...options,
    onclone: (document, element) => {
      element.style.height = screenshotHeight ? `${screenshotHeight}px` : '';
      element.style.width = screenshotWidth ? `${screenshotWidth}px` : '';
      if (onclone) {
        onclone(document, element);
      }
    }
  }), [screenshotHeight, screenshotWidth, onclone]);

  useEffect(() => {
    (async () => {
      if (enabled && element) {
        setResult({ ...initialResult, loading: true });
        try {
          const canvas = await toCanvas(element, _options);
          const [url, blob] = await toImageURL(canvas);
          setResult({ loading: false, error: null, url, blob, canvas });
        } catch (err) {
          setResult({ ...initialResult, error: err });
        }
      } else {
        setResult(initialResult);
      }
    })();
  }, [enabled, element, _options]);

  return result;
};

export default useScreenshot;
