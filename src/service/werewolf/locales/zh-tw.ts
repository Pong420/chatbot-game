import { defineMessages } from '@/utils/locale';
import { characters } from '@werewolf/character';

export const Character: Record<keyof typeof characters, string> = {
  Villager: `村民`,
  Werewolf: `狼人`,
  Witcher: `女巫`,
  Guard: `守衛`,
  Hunter: `獵人`,
  Predictor: `預言家`
};

export const IamCommand = (() => {
  const Iam = '我是{0}';

  const entries = Object.entries(Character) as [keyof typeof Character, string][];

  const IamCommands = entries.reduce(
    (res, [key, value]) => ({ ...res, [`Iam${key}`]: Iam.replace('{0}', value) }),
    {} as Record<`Iam${keyof typeof Character}`, string>
  );

  return {
    Iam,
    ...IamCommands,
    ...entries.reduce(
      (res, [key, value]) => ({ ...res, [`${key}DM`]: `${value}請私我輸入「${IamCommands[`Iam${key}`]}」` }),
      {} as Record<`${keyof typeof Character}DM`, string>
    )
  };
})();

export const CharacterIntroCommand = (() => {
  const CharacterIntro = '{0}簡介';
  return {
    CharacterIntro,
    ...Object.entries(Character).reduce(
      (res, [key, value]) => ({ ...res, [`${key}Intro`]: CharacterIntro.replace('{0}', value) }),
      {} as Record<`${keyof typeof Character}Intro`, string>
    )
  };
})();

export const HostCommand = {
  Initiate: `開啟狼人殺`,
  Open: `狼人殺設定完畢`,
  Start: `狼人殺開始`,
  End: `狼人殺結束`,
  Survivor: `狼人殺倖存者`,
  'DeathReport': '死亡報告',
  HostCommands: `主持指令`
};

export const StageCommand = {
  // PlayerReport = `^(.*)的報告`,
  NextShort: 'n',
  Next: '/next',
  Skip: '/skip'
};

export const KillerCommand = {
  Kill: `^我要殺(.*)`,
  Suicide: `我要自殺`,
  Idle: `今晚是平安夜`
};

export const GuardCommand = {
  IamGuard: `我是守衛`,
  Protect: `^我要守護(.*)`,
  ProtectSelf: `我守護自己`,
  NoProtect: `不守護任何人`
};

export const WitcherCommand = {
  IamWitcher: `我是女巫`,
  Rescue: `^我要救(.*)`,
  NoRescue: `不救`,
  Poison: `對(.*)使用毒藥`,
  NoPoison: `不使用毒藥`
};

export const PredictorCommand = {
  IamPredictor: `我是預言家`,
  Predict: `^我要預測(.*)`
};

export const HunterCommand = {
  IamHunter: `我是獵人`,
  Shot: `^我要對(.*)開槍`,
  NoShot: `放棄開槍`
};

export const CommonCommand = {
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
    NoEnoughPlayers: '遊戲人數不能少於{0}人',
    NicknameUsed: `暱稱「{0}」已被使用，請更換後再參加`,

    Self: '自己',
    TurnEnded: ['你已作出了選擇！', `有些事...無法改變!`],
    StageNotEnded: '仍有玩家未完成行動，無法進入下回合',
    YouDead: '安息吧，你已經死了！',
    NotYourTurn: '現在幹這件事不合適吧？',
    TargetIsDead: ['{0}已死亡'],
    TargetNoExists: ['{0}不存在'],

    VoteNotStarted: `現在不是投票時間`,
    Voted: '我感受到{0}你對投票的渴望，但每人只有一票！',
    VoteOutOfRange: '{0}不在投票範圍',

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
    YouAreVillager: `你是「${Character.Villager}」，請努力活下去！`,
    CharacterIntroButton: '角色簡介',

    NightBoard: '現在是晚上',
    GettingDark: '天快黑了',
    WerewolfEnd: `狼人已選擇目標`,

    IamWerewolfGroup: [`喂，是警察叔叔嗎，這裏有狼人哇`, `欸，我也是耶，「嗷嗚~~」`, `「嗷嗚~~」(暗號呢`],
    KillSuccss: '好',
    SuicideSuccss: [`你就這麼有信心有人救你？`, `希望你能賭贏吧！`],
    IdleSuccess: `'你竟然忍住了!? 但你下一晚不可能再忍受饑餓，快想明天的晚餐吧!`,
    Hungry: ['平安夜？不，你餓了，快選一個晚餐吧', '什麼都能忍，餓不能！快選一個晚餐吧'],
    DuplicatedKill: '知道了，你們是有多大仇!?',
    DuplicatedSuicide: '知道了，你就這麼想死嗎?',
    CantKillDeadTarget: ['{0}已經死了，你是有多大仇!?', '{0}已經死了，原諒他吧'],

    IamGuardGroup: `你是好人，請守護我(\´▽\`ʃ♡ƪ)`,
    ProtectSuccess: [`好`, `你是好人`],
    ProtectSelfSuccess: [
      `只有自己可以救自己`,
      `你對是對的，自私一點有錯麼？`,
      '人不為己，天誅地滅',
      '正所謂，死道友不死貧道'
    ],
    DuplicatedProtected: ['還有其他人需要你的守護', `我明白你很想守護對方，但不能連續守護`],
    DuplicatedProtectedSelf: [
      '你忘了你的責任了嗎，是守護別人啊!',
      '你本打算繼續守護自己，但良心隱隱作痛，放棄了這個想法'
    ],
    NoProtectSuccess: `好`,

    IamWitcherGroup: [
      `喂，是霍格華茲嗎，你們是不是有個「女巫」跑了`,
      `欸，你認識哈利嗎?`,
      `去去武器走！( ☉_☉)≡☞o────★°`
    ],
    RescueSuccess: [`阿彌陀佛，救人一命，勝造七級浮屠`, `你是個好人`],
    RescueSelfSuccess: [`只有自己可以救自己`, `沒錯，自私一點有錯麼？`, '人不為己，天誅地滅', '正所謂，死道友不死貧道'],
    PoisonSuccess: [`毒藥用對了，也是救命藥，希望你的選擇沒有錯`, `對，病人該吃藥了!`],
    TargetNotInjured: `{0}沒有受傷啊`,
    Rescued: `沒有傷藥了`,
    Poisoned: `沒有毒藥了`,
    PoisonSelf: ['這不是正常操作，選別人吧'],

    IamPredictorGroup: [`看，這裏有個神棍`, `請給我下期的彩票號碼，拜託了`],
    PredictResultGood: `{0}是好人`,
    PredictResultBad: `{0}是壞人`,
    Predicted: `你已經知道「{0}」的身份是【{1}】，偷窺其他人吧`,
    PredictSelf: [`{0}是【神棍】`, `{0}是【偷窺狂】`],

    IamHunterGroup: [`你是正式錄用的獵人嗎`, `我是好人，不要射我`],
    ShootSuccess: `好`,
    NoShootSuccess: `好`,
    ShootSelf: `你要死了，這一槍留給別人吧`,
    NotReadyForShoot: '再等等，還未到開槍的時候',

    DaytimeBoard: '現在是白天',

    VoteBoard: `投票階段, {0}/{1}`,
    VoteEndBoard: `投票結束`,

    ClickToVote: '點擊名稱即可進行投票',
    ClickToSelect: '點擊名稱選擇目標'

    // TODO:
    // 遇到錯誤時，請主持人輸入「${Command}」,
    // 參與狼人殺，累積成就能夠獲得稱號，輸入「${Command.Titles}」了解
  },
  Character,
  IamCommand,
  CharacterIntroCommand,
  CommonCommand,
  HostCommand,
  StageCommand,
  KillerCommand,
  GuardCommand,
  WitcherCommand,
  PredictorCommand,
  HunterCommand
);
