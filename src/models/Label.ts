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
