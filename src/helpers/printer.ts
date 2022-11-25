import { ColorsEnum } from '../models';

export const error = (msg: string): void => {
  console.error(colorize(msg, ColorsEnum.Red));
};

export const info = (msg: string): void => {
  console.info(colorize(msg, ColorsEnum.Green));
};

export const debug = (msg: string): void => {
  console.log(colorize(msg, ColorsEnum.Blue));
};

export const log = (msg: any): void => {
  console.log(msg);
};

export const warning = (msg: string): void => {
  console.warn(msg, ColorsEnum.Default);
};

const colorize = (msg: string, color: ColorsEnum): string => {
  return `${color}[APP] ${msg}${ColorsEnum.Default}`;
};
