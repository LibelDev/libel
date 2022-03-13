import format from 'date-fns/format';
import { immerable } from 'immer';
import { shortenedHost } from '../constants/lihkg';
import { mapSourceToPost } from '../helpers/label';
import { getShareId } from '../helpers/lihkg';

type TLabelText = string;

export interface ILabel {
  id: string;
  text: TLabelText;
  reason?: string;
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
  id: string;
  text: string;
  reason?: string;
  /** @deprecated */
  url?: string;
  date?: number;
  source?: ISource;
  color?: string;
  image?: string;

  constructor (
    id: string,
    text: string,
    reason?: string,
    url?: string,
    date?: number,
    source?: ISource,
    color?: string,
    image?: string
  ) {
    this.id = id;
    this.text = text;
    this.reason = reason || undefined;
    this.url = url || undefined;
    this.date = date || undefined;
    this.source = source || undefined;
    this.color = color || undefined;
    this.image = image || undefined;
  }

  static deserialize (label: Label | ILabel) {
    if (label instanceof Label) {
      return label;
    }
    const { id, text, reason, url, date, source, color, image } = label;
    return new Label(id, text, reason, url, date, source, color, image);
  }

  get displayDate () {
    const { date } = this;
    if (date) {
      return format(date, 'yyyy年MM月dd日 HH:mm:ss');
    }
  }

  get shareID () {
    const { source } = this;
    if (source) {
      const post = mapSourceToPost(source);
      return getShareId(post);
    }
  }

  get shareURL () {
    const { shareID } = this;
    if (shareID) {
      return `${shortenedHost}/${shareID}`;
    }
    // fallback to the deprecated url
    return this.url;
  }

  clone (deep?: boolean) {
    const { id, text, reason, url, date, source, color, image } = this;
    const clone = new Label(id, text, reason, url, date, source, color, image);
    if (deep) {
      clone.source = source && { ...source };
    }
    return clone;
  }
}

export default Label;
