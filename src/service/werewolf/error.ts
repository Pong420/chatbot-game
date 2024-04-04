const keys = [
  'SYSTEM_ERROR',
  'TURN_ENDED',
  'HUNGRY',
  'STAGE_NOT_ENDED',
  'GAME_FULL',
  'NOT_ENOUGH_PLAYERS',
  'DUPLICATED_JOIN',
  'YOU_DEAD',
  'NOT_YOUR_TURN',
  'VOTED',
  'TARGET_IS_DEAD'
] as const;

export class WerewolfError extends Error {} // for future use, attached with more information
export type WerewolfErrorKey = (typeof keys)[number];
export const errors = (key: WerewolfErrorKey) => key;
