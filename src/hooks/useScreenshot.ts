import type { Options } from 'html2canvas';
import { useEffect, useState } from 'react';
import { toImageURL } from '../helpers/canvas';

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

const useScreenshot = (element?: HTMLElement | null, options?: Partial<Options>): IState => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    (async () => {
      if (element) {
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
  }, [element, options]);
  return state;
};

export default useScreenshot;
