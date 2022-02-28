export const replaceNewLines = (text: string, replacement: string) => {
  const regex = /[\n|\r]+/g;
  return text.replace(regex, replacement);
};
