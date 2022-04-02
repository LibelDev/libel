import type { Options } from 'html2canvas';
import { useEffect, useState } from 'react';
import { toImageURL } from '../helpers/canvas';

export type TOptions = Partial<Options>;

interface IState {
  loading: boolean;
  error: unknown | null;
  url: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
}

const initialState: IState = {
  loading: false,
  error: null,
  url: null,
  blob: null,
  canvas: null
};

const useScreenshot = (enabled: boolean, element?: HTMLElement | null, options?: TOptions): IState => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    (async () => {
      if (enabled && element) {
        setState({ ...state, loading: true });
        try {
          const [url, blob, canvas] = await toImageURL(element, options);
          setState({ loading: false, error: null, url, blob, canvas });
        } catch (err) {
          setState({ ...initialState, error: err });
        }
      } else {
        setState(initialState);
      }
    })();
  }, [enabled, element, options]);
  return state;
};

export default useScreenshot;
