import { useCallback, useState } from 'react';
import { mergeCanvas, toCanvas, toImageURL } from '../helpers/canvas';

type TToCanvasOptions = NonNullable<Parameters<typeof toCanvas>[1]>;

export type TOptions = TToCanvasOptions;

interface IState {
  loading: boolean;
  error: unknown | null;
  url: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
}

type TCaptureFunction = (enabled?: boolean) => Promise<void>;

type TResult = [IState, TCaptureFunction];

const initialState: IState = {
  loading: false,
  error: null,
  url: null,
  blob: null,
  canvas: null
};

const useScreenshot = <E extends HTMLElement> (elements?: E[], options?: TOptions): TResult => {
  const [state, setState] = useState(initialState);

  const capture = useCallback(async (enabled = true) => {
    if (enabled && elements && elements.length) {
      setState({ ...initialState, loading: true });
      try {
        const promises = elements.map((element) => toCanvas(element, options));
        const canvases = await Promise.all(promises);
        const canvas = mergeCanvas(canvases[0], canvases[1]);
        const [url, blob] = await toImageURL(canvas);
        setState({ loading: false, error: null, url, blob, canvas });
      } catch (err) {
        setState({ ...initialState, error: err });
      }
    } else {
      setState(initialState);
    }
  }, [elements, options]);

  return [state, capture];
};

export default useScreenshot;
