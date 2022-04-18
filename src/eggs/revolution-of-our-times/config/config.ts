import { isMainApp } from '../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
const date = now.getDate();
export const enabled = (
  month === 6
  && date === 9
  && isMainApp()
);
