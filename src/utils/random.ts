import crypto from 'crypto';

// includeslive
export const randomInt = (min: number, max: number) => crypto.randomInt(min, max + 1);
export const randomOption = <T>(data: T[]) => data[randomInt(0, data.length - 1)];
export const randomPick = <T>(data: T[]) => {
  const idx = randomInt(0, data.length - 1);
  return data.splice(idx, 1)[0];
};
