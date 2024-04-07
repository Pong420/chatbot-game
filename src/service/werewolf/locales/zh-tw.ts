export default {
  SystemError: '系統錯誤',
  GameIsFull: '人數已滿，「{0}」下次請早',
  Joined: '{0}你已經參加遊戲，我明白你很想要，但不要急',
  NoEnoughPlayers: '遊戲人數不能少於6人',
  TurnEnded: '你已作出了選擇！',
  StageNotEnded: '仍有玩家未完成行動，無法進入下回合',
  YouDead: '安息吧，你已經死了！',
  NotYourTurn: '目前不是你的行動回合',
  Voted: '我感受到{0}你對投票的渴望，但每人只有一票！',
  VoteOutOfRange: '{0}不在投票範圍',
  TargetIsDead: ['{0}已經死了，你是有多大仇!?', '{0}已經死了，原諒他吧'],

  /**
   * Werewolf
   */
  Hungry: ['平安夜？不，你餓了，快選一個晚餐吧', '什麼都能忍，餓不能！快選一個晚餐吧'],
  DuplicatedKill: '知道了，你們是有多大仇!?',
  DuplicatedSuicide: '知道了，你就這麼想死嗎?'
} satisfies Record<string, string | string[]>;
