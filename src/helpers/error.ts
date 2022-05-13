export const getErrorMessage = (err: unknown, defaultErrorMessage: string) => {
  if (typeof err === 'string') {
    return err;
  }
  return defaultErrorMessage;
};
