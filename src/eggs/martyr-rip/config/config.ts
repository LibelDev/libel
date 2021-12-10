import imageRipCat from '../../../../assets/images/lihkg/emotes/rip/cat.webp';
import imageRipCow from '../../../../assets/images/lihkg/emotes/rip/cow.webp';
import imageRipDog from '../../../../assets/images/lihkg/emotes/rip/dog.webp';
import imageRipFlower from '../../../../assets/images/lihkg/emotes/rip/flower.webp';
import imageRipMouse from '../../../../assets/images/lihkg/emotes/rip/mouse.gif';
import imageRipPig from '../../../../assets/images/lihkg/emotes/rip/pig.webp';
import { isMainApp } from './../../../helpers/app';

const now = new Date();
const month = now.getMonth() + 1;
export const enabled = (
  month === 7
  && isMainApp()
);

export const images = [
  imageRipCat,
  imageRipCow,
  imageRipDog,
  imageRipFlower,
  imageRipMouse,
  imageRipPig
];
