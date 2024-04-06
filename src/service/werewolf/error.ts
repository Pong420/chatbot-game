const keys = [
  'SYSTEM_ERROR',
  'GAME_FULL',
  'DUPLICATED_JOIN',
  'NOT_ENOUGH_PLAYERS',
  'STAGE_NOT_ENDED',
  'YOU_DEAD',
  'TURN_ENDED',
  'NOT_YOUR_TURN',
  'VOTED',
  'VOTE_OUT_OF_RANGE',
  'TARGET_IS_DEAD',
  'HUNGRY'
] as const;

export class WerewolfError extends Error {} // for future use, attached with more information
export type WerewolfErrorKey = (typeof keys)[number];
export const errors = (key: WerewolfErrorKey) => key;
