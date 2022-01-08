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
  text!: string;
  reason?: string;
  url?: string;
  date?: number;
  source?: ISource;
  color?: string;
  image?: string;

  constructor (text: string, reason?: string, url?: string, date?: number, source?: ISource, color?: string, image?: string) {
    this.text = text;
    this.reason = reason;
    this.url = url;
    this.date = date;
    this.source = source;
    this.color = color;
    this.image = image;
  }

  static deserialize (label: Label | ILabel) {
    if (label instanceof Label) {
      return label;
    }
    const { text, reason, url, date, source, color, image } = label;
    return new Label(text, reason, url, date, source, color, image);
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
}

export default Label;
