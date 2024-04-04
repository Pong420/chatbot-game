const keys = ['END_TURN', 'HUNGRY', 'NOT_END', 'GAME_FULL', 'NOT_ENOUGH_PLAYERS', 'DUPLICATED_JOIN'] as const;

export type WerewolfError = (typeof keys)[number];
export const errors = (key: WerewolfError) => key;
