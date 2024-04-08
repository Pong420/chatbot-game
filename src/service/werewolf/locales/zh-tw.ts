import { defineMessages } from '@/utils/locale';

export const WerewolfCharacter = {
  Villager: `村民`,
  Werewolf: `狼人`,
  Witcher: `女巫`,
  Guard: `守衛`,
  Hunter: `獵人`,
  Predictor: `預言家`
};

export const WerewolfIamCommand = (() => {
  const Iam = '我是{0}';
  return {
    Iam,
    ...Object.entries(WerewolfCharacter).reduce(
      (res, [key, value]) => ({ ...res, [`Iam${key}`]: Iam.replace('{0}', value) }),
      {} as Record<`Iam${keyof typeof WerewolfCharacter}`, string>
    )
  };
})();

export const WerewolfCharacterIntroCommand = (() => {
  const CharacterIntro = '{0}簡介';
  return {
    CharacterIntro,
    ...Object.entries(WerewolfCharacter).reduce(
      (res, [key, value]) => ({ ...res, [`${key}Intro`]: CharacterIntro.replace('{0}', value) }),
      {} as Record<`${keyof typeof WerewolfCharacter}Intro`, string>
    )
  };
})();

export const WerewolfHostCommand = {
  Initiate: `開啟狼人殺`,
  Open: `狼人殺設定完畢`,
  Start: `狼人殺開始`,
  End: `狼人殺結束`,
  Survivor: `狼人殺倖存者`,
  'DeathReport': '死亡報告',
  HostCommands: `主持指令`
};

export const WerewolfStageCommand = {
  // PlayerReport = `^(.*)的報告`,
  NextShort: 'n',
  Next: '/next',
  Skip: '/skip'
};

export const WerewolfKillerCommand = {
  Kill: `^我要殺(.*)`,
  Suicide: `我要自殺`,
  NoKill: `今晚是平安夜`
};

export const WerewolfCommonCommand = {
  Intro: '狼人殺介紹',
  MyCharacter: `我的狼人殺角色`,
  Vote: `^我投(.*)`,
  Waive: `棄權`,
  WhoNotVoted: `誰未投票`
};

export default defineMessages(
  {
    SystemError: '系統錯誤',

    GameIsFull: '人數已滿，「{0}」下次請早',
    Joined: '{0}你已經參加遊戲',
    NoEnoughPlayers: '遊戲人數不能少於6人',
    NicknameUsed: `暱稱「{0}」已被使用，請更換後再參加`,

    Self: '自己',
    TurnEnded: '你已作出了選擇！',
    StageNotEnded: '仍有玩家未完成行動，無法進入下回合',
    YouDead: '安息吧，你已經死了！',
    NotYourTurn: '目前不是你的行動回合',
    Voted: '我感受到{0}你對投票的渴望，但每人只有一票！',
    VoteOutOfRange: '{0}不在投票範圍',
    TargetIsDead: ['{0}已經死了，你是有多大仇!?', '{0}已經死了，原諒他吧'],

    GameName: `狼人殺`,
    JoinButton: `參加`,
    Join: `我要參加狼人殺`,
    StartButton: `開始遊戲`,
    Tips: `遊戲提示`,

    ShortIntro: `
      遊戲人數最少6人，最多12人,
      主持人可以輸入「{0}」查詢指令,
      謹記！友誼第一，這只是遊戲，不要太認真
    `,

    Players: '參賽者',

    Started: `狼人殺已開始`,
    NotStarted: `狼人殺未開始`,
    NotJoined: `你未參加狼人殺`,
    WaitFotHostSetup: `請等待主持完成配置`,

    YourCharacter: '你的角色',
    YourAreCharacter: '你是「{0}」留意群組訊息，到你的回合後，請按指示輸入指令或點擊按鈕',
    YouAreVillager: `你是「${WerewolfCharacter.Villager}」，請努力活下去！`,
    CharacterIntroButton: '角色簡介',

    KillSuccss: '好',
    Hungry: ['平安夜？不，你餓了，快選一個晚餐吧', '什麼都能忍，餓不能！快選一個晚餐吧'],
    DuplicatedKill: '知道了，你們是有多大仇!?',
    DuplicatedSuicide: '知道了，你就這麼想死嗎?'

    // TODO:
    // 遇到錯誤時，請主持人輸入「${WerewolfCommand}」,
    // 參與狼人殺，累積成就能夠獲得稱號，輸入「${WerewolfCommand.Titles}」了解
  },
  WerewolfCharacter,
  WerewolfIamCommand,
  WerewolfCharacterIntroCommand,
  WerewolfCommonCommand,
  WerewolfHostCommand,
  WerewolfStageCommand,
  WerewolfKillerCommand
);
