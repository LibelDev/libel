import format from 'date-fns/format';
import { immerable } from 'immer';

export interface ILabel {
  text: string;
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

// deprecated
export interface ILabelDatum {
  user: string;
  labels: (ILabel | string)[];
}

class Label implements ILabel {
  [immerable] = true;
  text: string;
  reason?: string;
  /**
   * @deprecated
   */
  url?: string;
  date?: number;
  source?: ISource;
  color?: string;
  image?: string;

  constructor (text: string, reason?: string, url?: string, date?: number, source?: ISource, color?: string, image?: string) {
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
    const { text, reason, url, date, source, color, image } = label;
    return new Label(text, reason, url, date, source, color, image);
  }

  get displayDate () {
    const { date } = this;
    if (date) {
      return format(date, 'yyyy年MM月dd日 HH:mm:ss');
    }
  }

  get sourceURL () {
    const { source } = this;
    if (source) {
      const { thread, page, messageNumber: post } = source;
      return `https://lihkg.com/thread/${thread}/page/${page}?post=${post}`;
    }
    // fallback to generic url
    return this.url;
  }

  clone (deep?: boolean) {
    const { text, reason, url, date, source, color, image } = this;
    const clone = new Label(text, reason, url, date, source, color, image);
    if (deep) {
      clone.source = source && { ...source };
    }
    return clone;
  }
}

export default Label;
