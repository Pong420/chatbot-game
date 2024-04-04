const keys = [
  'END_TURN',
  'HUNGRY',
  'NOT_END',
  'GAME_FULL',
  'NOT_ENOUGH_PLAYERS',
  'DUPLICATED_JOIN',
  'YOU_DEAD',
  'NOT_YOUR_TURN'
] as const;

export class WerewolfError extends Error {} // for future use, attached with more information
export type WerewolfErrorKey = (typeof keys)[number];
export const errors = (key: WerewolfErrorKey) => key;
