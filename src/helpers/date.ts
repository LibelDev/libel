export enum Format {
  Timestamp,
  Display
}

const padZero = (number: number) => {
  return number >= 10 ? `${number}` : `0${number}`;
};

export const format = (date: Date, format: Format) => {
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;
  const _date = date.getDate();
  switch (format) {
    case Format.Timestamp: {
      const YYYY = _year;
      const MM = padZero(_month);
      const DD = padZero(_date);
      const HH = padZero(date.getHours());
      const mm = padZero(date.getMinutes());
      const ss = padZero(date.getSeconds());
      return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
    }
    case Format.Display: {
      return `${_year}年${_month}月${_date}日`;
    }
  }
};

export const getCurrentTimestamp = () => {
  return format(new Date(), Format.Timestamp);
}
