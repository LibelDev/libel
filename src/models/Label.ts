import { immerable } from 'immer';

type TLabelText = string;

export interface ILabel {
  id?: string;
  text: TLabelText;
  reason?: string;
  /** @deprecated */
  url?: string;
  date?: number;
  source?: ISource;
  color?: string;
  image?: string;
}

export interface ISource {
  thread: string;
  page: number;
  messageNumber: string;
}

/** @deprecated */
export interface ILabelDatum {
  user: string;
  labels: (ILabel | TLabelText)[];
}

class Label implements ILabel {
  [immerable] = true;

  constructor (
    /**
     * the label ID
     * - `-1` converted from blocked user
     * @since 3.0.0
     */
    public id: string | undefined,
    public text: string,
    public reason?: string,
    /** @deprecated */
    public url?: string,
    public date?: number,
    public source?: ISource,
    public color?: string,
    public image?: string
  ) { }

  static deserialize (label: Label | ILabel) {
    if (label instanceof Label) {
      return label;
    }
    const { id, text, reason, url, date, source, color, image } = label;
    return new Label(id, text, reason, url, date, source, color, image);
  }

  // clone (deep?: boolean) {
  //   const { id, text, reason, url, date, source, color, image } = this;
  //   const clone = new Label(id, text, reason, url, date, source, color, image);
  //   if (deep) {
  //     clone.source = source && { ...source };
  //   }
  //   return clone;
  // }
}

export default Label;
