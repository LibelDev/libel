import { SUBSCRIPTION_MESSAGE_QUESTION_ADD } from '../constants/texts';

export const prompt = () => {
  const url = window.prompt(SUBSCRIPTION_MESSAGE_QUESTION_ADD);
  return url;
};
