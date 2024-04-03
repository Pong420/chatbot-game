const messages = {
  DUPLICATED_JOIN: '已經加入遊戲',
  MAXIMUM_PLAYERS_EXCEED: '遊戲已滿',
  NOT_ENOUGH_PLAYERS: '遊戲人數不足以開始遊戲'
};

export const KEYS = Object.keys(messages).reduce(
  (res, k) => ({ ...res, [k]: k }),
  {} as { [K in keyof typeof messages]: K }
);

// eslint-disable-next-line import/no-anonymous-default-export
export default { ...messages, KEYS };
