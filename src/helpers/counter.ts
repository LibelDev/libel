export const counter = function* () {
  let i = 0;
  while (true) {
    yield i++;
  }
};
