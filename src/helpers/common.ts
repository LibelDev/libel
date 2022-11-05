export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const getElementLabelTipProps = (label: string) => {
  return {
    'aria-label': label,
    'data-tip': label,
    title: label
  };
};
