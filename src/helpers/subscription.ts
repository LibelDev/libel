import { ADD_SUBSCRIPTION_QUESTION } from '../constants/texts';

export const prompt = () => {
  const url = window.prompt(ADD_SUBSCRIPTION_QUESTION);
  return url;
};
