export const getSearchRegex = (search: string) => {
  const keywords = search
    .split(/\s/) // search each part of the keyword
    .filter(Boolean); // remove empty strings
  const pattern = `(${keywords.join('|')})`;
  const regex = new RegExp(pattern, 'i');
  return regex;
};
