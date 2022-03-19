export const counter = function* (initial = 0) {
  let i = initial;
  while (true) {
    yield i++;
  }
};
