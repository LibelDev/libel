export interface ILabel {
  text: string;
  reason?: string;
  url?: string;
  date?: number;
  source?: ISource;
}

interface ISource {
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
  text!: string;
  reason?: string;
  url?: string;
  date?: number;
  source?: ISource;

  constructor (text: string, reason?: string, url?: string, date?: number, source?: ISource) {
    this.text = text;
    this.reason = reason;
    this.url = url;
    this.date = date;
    this.source = source;
  }

  static deserialize (label: Label | ILabel) {
    if (label instanceof Label) {
      return label;
    }
    const { text, reason, url, date, source } = label;
    return new Label(text, reason, url, date, source);
  }

  get sourceURL () {
    const { url, source } = this;
    if (source) {
      const { thread, page, messageNumber } = source;
      return `https://lihkg.com/thread/${thread}/page/${page}?post=${messageNumber}`;
    }
    return url;
  }
}

export default Label;
