import { isMainApp } from '../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
export const enabled = (
  month === 6
  && date === 4
  && isMainApp()
);

export const caption = '點擊以避免遺忘';

export const videoURL = 'https://www.youtube.com/watch?v=qq8zFLIftGk';
