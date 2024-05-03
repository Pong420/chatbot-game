import { defineMessages } from '@/utils/locale';
import type { CharacterKey } from '@werewolf/character';

export const Character: Record<CharacterKey, string> = {
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
      (res, [key, value]) => ({
        ...res,
        [`${key}DM`]: `【${value}】請點擊按鈕或私我輸入【${IamCommands[`Iam${key}`]}】`
      }),
      {} as Record<`${keyof typeof Character}DM`, string>
    )
  };
})();

export const HostCommand = {
  Initiate: [`開啟狼人殺`, `狼人殺開啟`],
  SetupCompleted: `狼人殺設定完畢`,
  Start: [`狼人殺開始`, `開始狼人殺`],
  End: [`狼人殺結束`, `結束狼人殺`],
  Survivors: `狼人殺倖存者`,
  DeathReport: '狼人殺死亡報告',
  WhoNotVoted: `誰未投票`,
  PlayerReport: `^(.*)的報告`
};

export const StageCommand = {
  NextShort: 'n',
  Next: '/next',
  Skip: '/skip'
};

export const KillerCommand = {
  Kill: `^我要殺(.*)`,
  Suicide: `我要自殺`,
  Idle: `平安夜`
};

export const GuardCommand = {
  IamGuard: `我是守衛`,
  Protect: `^我要守護(.*)`,
  ProtectSelf: `守護自己`,
  NoProtect: `不守護任何人`
};

export const WitcherCommand = {
  IamWitcher: `我是女巫`,
  Rescue: `^為(.*)治療`,
  Poison: `^對(.*)下毒`,
  NotUseMedicine: `不使用藥物`,
  ShowRescueBoard: `我要救人`,
  ShowPoisonBoard: `我要下毒`
};

export const PredictorCommand = {
  IamPredictor: `我是預言家`,
  Predict: `^我要檢查(.*)`
};

export const HunterCommand = {
  IamHunter: `我是獵人`,
  Shoot: `^我要對(.*)開槍`,
  NoShoot: `不開槍`
};

export const CommonCommand = {
  MyCharacter: `我的狼人殺角色`,
  Vote: `^我投(.*)`,
  Waive: `棄權`
};

export default defineMessages(
  {
    GameName: `狼人殺`,
    SystemError: '系統錯誤',

    SettingsDesc: `
      主持人需要不斷主動輸入【{0}】判斷玩家是否完成操作
      點擊下方按鈕，使用預設或者自選設定繼續遊戲
    `,
    UseDefaultSetup: `使用預設`,
    UseCustomSetup: `自選`,
    WaitFotHostSetup: `請等待主持完成配置`,
    AvailableCharacters: `自選角色`,
    AvailableCharactersDefault: `可用角色視乎最終遊戲人數`,
    WerewolvesKnowEachOthers: `狼人會知道誰是隊友`,
    WerewolvesDontKnowEachOthers: `狼人不知道誰是隊友`,
    Friendship: `謹記！友誼第一`,

    Players: '參賽者',
    JoinButton: `參加`,
    Join: `我要參加狼人殺`,
    StartButton: `開始遊戲`,
    GameIsFull: '人數已滿，下次請早',
    Joined: '{0}你已經參加遊戲',
    NoEnoughPlayers: '遊戲人數不能少於{0}人',
    NicknameUsed: `暱稱【{0}】已被使用，請更換後再參加`,
    Started: `狼人殺已開始`,
    NotStarted: `狼人殺未開始`,
    NotJoined: `你未參加狼人殺`,
    StartBoard: `遊戲開始`,
    StartBoardDesc: `參與者請私聊機器人輸入或直接點擊【{0}】`,
    StartBoardDesc2: `主持人可以輸入【{0}】查詢是否能進入下一回合，【{1}】強制進入下一回合`,
    StartBoardCharacters: `角色`,

    YourCharacter: '你的角色',
    YourAreCharacter: '你是【{0}】留意群組訊息，到你的回合後，請按指示輸入指令或直接點擊按鈕',
    YouAreVillager: `你是【${Character.Villager}】，請努力活下去！`,
    CharacterIntroButton: '角色簡介',
    YouAreNot: `不，你不是`,

    Self: '自己',
    TurnEnded: ['你已作出了選擇', `有些事...無法改變`],
    StageNotEnded: '仍有玩家未完成行動，無法進入下回合',
    YouDead: '安息吧，你已經死了！',
    NotYourTurn: ['現在幹這件事不合適吧？'],
    NotYourTurn2: ['還不是你的回合'],
    TargetIsDead: ['{0}已死亡，請重新選擇'],
    TargetNoExists: ['{0}不存在，請檢查是否輸入錯誤'],

    NightBoard: '現在是晚上',

    IamVillagerGroup: [`你確定你【村民】不是【暴民】嗎?`],

    IamWerewolfGroup: [`喂，警察叔叔嗎，這裏有狼人哇`, `欸，我也是耶`, `嗷嗚~~`, `啊，我好怕啊`],
    KillSuccss: '好',
    SuicideSuccss: [`你就這麼有信心有人救你？`, `希望你能賭贏吧！`],
    IdleSuccess: `你竟然忍住了!? 但下一晚不可能再忍受饑餓，快想明天的晚餐吧!`,
    Hungry: ['平安夜？不，你餓了，快選一個晚餐吧', '什麼都能忍，餓不能！快選一個晚餐吧'],
    DuplicatedKill: '知道了，你們是有多大仇!?',
    DuplicatedSuicide: '知道了，你就這麼想死嗎?',
    CantKillDeadTarget: ['{0}已經死了，你們是有多大仇!?', '{0}已經死了，放過他吧'],
    ClickToSelect: '點擊名稱選擇目標',

    IamGuardGroup: `請守護我(\´▽\`ʃ♡ƪ)`,
    ProtectSuccess: [`好`, `你是好人`],
    ProtectSelfSuccess: [`只有自己可以救自己`, `你對是對的，自私一點有錯麼？`, '人不為己，天誅地滅'],
    DuplicatedProtected: ['還有其他人需要你的守護', `我明白你很想守護對方，但不能連續守護`],
    DuplicatedProtectedSelf: [
      '你忘了你的責任了嗎，是守護別人啊!',
      '你本打算繼續守護自己，但良心隱隱作痛，放棄了這個想法'
    ],
    NoProtectSuccess: `好`,
    GuardBoard: '點擊名稱選擇要守護的目標',

    IamWitcherGroup: [
      `喂，是霍格華茲嗎？你們是不是有個【女巫】跑了`,
      `欸，你認識哈利嗎?`,
      `去去武器走！( ☉_☉)≡☞o────★°`
    ],
    RescueSuccess: [`阿彌陀佛，救人一命，勝造七級浮屠`, `你是個好人`],
    RescueSelfSuccess: [`只有自己可以救自己`, `沒錯，自私一點有錯麼？`, '人不為己，天誅地滅'],
    PoisonSuccess: [`毒藥用對了，也是救命藥，希望你的選擇沒有錯`, `對，病人該吃藥了`],
    TargetNotInjured: `{0}沒有受傷啊`,
    Rescued: `沒有傷藥了`,
    Poisoned: `沒有毒藥了`,
    PoisonSelf: ['這不是正常操作，選別人吧'],
    NoMoreMedicine: `你沒有藥了，系統會默認你已操作完成`,
    RescueBoard: '點擊名稱選擇你要治療的玩家',
    PoisonBoard: '點擊名稱選擇你要毒殺的玩家',
    NotUseMedicineSuccessSuccess: `好`,
    NoOneHurt: `沒有人受傷`,

    IamPredictorGroup: [`看，這裏有個神棍`, `請給我下期的彩票號碼，拜託了`, '(´ｰ∀ｰ`)'],
    PredictResult: `{0}是【{1}】`,
    Predicted: `你已經知道【{0}】的身份是【{1}】，偷窺其他人吧`,
    PredictSelf: [`{0}是【神棍】`, `{0}是【偷窺狂】`],
    PredictedAll: `還活著的都被你查看過了，系統會默認你完成操作`,
    PredictedGoodGuy: `好人`,
    PredictedBadGuy: `壞人`,
    PredictorBoard: '點擊名稱選擇你要查看的玩家',

    IamHunterGroup: [`你是正式錄用的獵人嗎`, `我是好人，不要射我`],
    ShootSuccess: `好`,
    NoShootSuccess: `好`,
    ShootSelf: `你要死了，這一槍留給別人吧`,
    NotReadyForShoot: '再等等，還未到開槍的時候',
    HunterBoardSubtitle: [
      '應該死去的獵人忽然動了，舉著獵槍指向你們',
      '「喀嚓」，大家一起看向聲音的來源，垂死的獵人舉著獵槍指向你們'
    ],
    HunterBoard: `點擊名稱選擇要射擊的目標`,
    ShootingSound: `砰`,
    NoOneWasShot: [`不知過了多久，獵人最終沒有開槍，然後倒下了`],

    DaytimeBoard: '現在是白天',
    NoOneDead: `沒有人死去`,
    SilenceForTheDeceased: `以上玩家死了，我們一起默哀一秒`,
    VoteBoard: `投票階段 {0}/{1}`,
    ClickToVote: '點擊名稱即可進行投票',
    ReVoteBoard: `第二輪投票, {0}/{1}`,
    ReVoteBoardFooter: `平票者不能投票，其餘玩家只能投票給平票者`,
    CandidateCantVote: `平票者不能投票`,
    VoteNotStarted: `現在不是投票時間`,
    Voted: '我感受到{0}你對投票的渴望，但每人只有一票！',
    VoteOutOfRange: '{0}不在投票範圍',
    VoteEndBoard: `投票結束`,
    Banishment: `{0}被處死了`,

    CannotShowReport: `遊戲未完結，無法顯示`
  },
  Character,
  IamCommand,
  CommonCommand,
  HostCommand,
  StageCommand,
  KillerCommand,
  GuardCommand,
  WitcherCommand,
  PredictorCommand,
  HunterCommand
);
