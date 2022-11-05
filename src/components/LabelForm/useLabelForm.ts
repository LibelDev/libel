import { useCallback, useState } from 'react';
import { uploadImage } from '../../apis/nacx';
import * as TEXTS from '../../constants/texts';
import type { TFormData } from './LabelForm';

type TUseLabelFormResult = [
  boolean,
  (data: TFormData) => Promise<string | undefined>
];

const useLabelForm = (): TUseLabelFormResult => {
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async (data: TFormData) => {
    const { meta } = data;
    const { screenshot } = meta;
    if (screenshot && screenshot.blob) {
      try {
        setLoading(true);
        const { status, url } = await uploadImage(screenshot.blob);
        switch (status) {
          case 200: {
            return url;
          }
          default: {
            throw TEXTS.LABEL_FORM_FIELD_ERROR_FAILED_TO_UPLOAD;
          }
        }
      } catch (err) {
        console.error(err);
        if (typeof err === 'string') {
          throw err;
        } else {
          throw TEXTS.LABEL_FORM_FIELD_ERROR_FAILED_TO_UPLOAD;
        }
      } finally {
        setLoading(false);
      }
    }
  }, []);

  return [loading, submit];
};

export default useLabelForm;
