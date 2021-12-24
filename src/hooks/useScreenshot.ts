import { Options } from 'html2canvas';
import { useEffect, useState } from 'react';
import { toImageURL } from '../helpers/canvas';

interface IState {
  loading: boolean;
  url: string | null;
  blob: Blob | null;
  canvas: HTMLCanvasElement | null;
}

const initialState: IState = {
  loading: false,
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
        const [url, blob, canvas] = await toImageURL(element, options);
        setState({ loading: false, url, blob, canvas });
      } else {
        setState(initialState);
      }
    })();
  }, [element, options]);
  return state;
};

export default useScreenshot;
