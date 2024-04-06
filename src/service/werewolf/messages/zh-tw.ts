import { WerewolfErrorKey } from '../error';

export const Messages: Record<WerewolfErrorKey, string | string[]> = {
  SYSTEM_ERROR: '系統錯誤',
  GAME_FULL: '人數已滿，「{0}」下次請早',
  DUPLICATED_JOIN: '{0}你已經參加遊戲，我明白你很想要，但不要急',
  NOT_ENOUGH_PLAYERS: '遊戲人數不能少於6人',
  TURN_ENDED: '你已作出了選擇！',
  STAGE_NOT_ENDED: '仍有玩家未完成行動，無法進入下回合',
  YOU_DEAD: '安息吧，你已經死了！',
  NOT_YOUR_TURN: '目前不是你的行動回合',
  VOTED: '我感受到{0}你對投票的渴望，但每人只有一票！',
  VOTE_OUT_OF_RANGE: '{0}不在投票範圍',
  TARGET_IS_DEAD: ['{0}已經死了，你到底有多恨!?', '{0}已經死了，原諒他吧'],

  /**
   * Werewolf
   */
  HUNGRY: '平安夜？不，你餓了，快點選一個晚餐吧'
};
