import { Action, FlexComponent } from '@line/bot-sdk';
import { t } from '@werewolf/locales';
import { Game } from '@werewolf/game';
import { Stage, VoteBaseStage, HunterEnd, End, Start } from '@werewolf/stage';
import { Character, Predictor, Villager, Werewolf } from '@werewolf/character';
import {
  messageAction,
  sendTextToBot,
  primaryButton,
  secondaryButton,
  createTableMessage,
  CreateTableMessageProps,
  wrapAndCenterText,
  centeredText,
  wrapedText,
  createFlexText,
  Payload,
  orderList,
  liffAction,
  postBackTextAction,
  uriAction
} from '@line/utils/createMessage';

interface PlayerListProps {
  names: string[];
  title?: CreateTableMessageProps['title'];
  buttons?: CreateTableMessageProps['buttons'];
  footer?: CreateTableMessageProps['footer'];
  action?: (name: string) => Action;
}

function tableMessage({ title = [], ...props }: CreateTableMessageProps) {
  return createTableMessage({
    fillCol: 0,
    title: [wrapAndCenterText(t(`GameName`)), ...title],
    ...props
  });
}

export function initiate(id: number) {
  return tableMessage({
    rows: orderList(t.paragraph('SettingsDesc')),
    buttons: [
      primaryButton(messageAction(t(`UseDefaultSetup`), t(`SetupCompleted`))),
      secondaryButton(liffAction(t(`UseCustomSetup`), `/werewolf/settings/${id}`))
    ]
  });
}

const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) => arr.slice(size * i, size + size * i));

export function settings(game: Game) {
  const stage = game.stage;
  if (!(stage instanceof Start)) throw new Error(`expect Start but receive ${stage.name}`);

  const characters = stage.getCharacters().reduce(
    (res, Character) => {
      const k = new Character().name;
      return { ...res, [k]: (res[k] || 0) + 1 };
    },
    {} as Record<string, number>
  );

  const rows: Payload[][] = [];

  let idx = 0;
  const row = (text: string) => {
    idx += 1;
    return [
      wrapedText(`${idx}.`, { flex: 0, align: 'start' }),
      wrapedText(text, {
        align: 'start',
        margin: 'md'
      })
    ];
  };

  if (game.customCharacters?.length) {
    rows.push(row(t(`AvailableCharacters`)));

    const _rows: Payload[] = [];
    const push = (name: string, count: string) =>
      _rows.push(
        wrapedText(name, { flex: 4, margin: 'xxl', align: 'start' }),
        wrapedText(count, { flex: 1, align: 'end' })
      );

    for (const k in characters) {
      const count = characters[k];
      if (!count) continue;
      push(k, 'x' + count);
    }

    if (_rows.length % 4 !== 0) {
      push(' ', ' ');
    }
    rows.push(...chunk(_rows, 4));
  } else {
    rows.push(row(t(`AvailableCharactersDefault`)));
  }

  rows.push(row(t(game.autoMode ? 'AutoModeEnabled' : 'AutoModeDisabled')));
  rows.push(row(t(game.werewolvesKnowEachOthers ? `WerewolvesDontKnowEachOthers` : `WerewolvesDontKnowEachOthers`)));

  return tableMessage({
    title: [centeredText(t(`SetupCompleted`))],
    rows,
    buttons: [primaryButton(messageAction(t(`JoinButton`), t('Join')))]
  });
}

export function players(stage: Stage) {
  if (!(stage instanceof Start)) return;

  const buttons: FlexComponent[] = [];

  if (stage.players.size >= stage.minPlayers)
    buttons.push(primaryButton(messageAction(t('StartButton'), t.raw('Start')[0])));
  else {
    buttons.push(
      primaryButton(messageAction(t(`JoinButton`), t('Join'))),
      wrapAndCenterText(t(`NoEnoughPlayers`, stage.minPlayers), { margin: 'xl', size: 'sm' }),
      wrapedText(' ', { margin: 'none', size: 'xxs' })
    );
  }

  return tableMessage({
    title: [centeredText(t(`Players`))],
    rows: Array.from(stage.players, ([, player], idx) => {
      return [
        wrapedText(`${idx + 1}.`, { flex: 0, align: 'start' }),
        wrapedText(player.nickname, {
          align: 'start',
          margin: !!player.nickname ? 'none' : 'md'
        })
      ];
    }),
    buttons
  });
}

export function start(game: Game) {
  const characters = [...game.players].reduce(
    (result, [, c]) => ({
      ...result,
      [c.name]: (result[c.name] || 0) + 1
    }),
    {} as Record<string, number>
  );

  const entries = Object.entries(characters);
  const charactersRows = entries.reduce(
    (cols, [name, count], i) => [
      ...cols,
      wrapedText(name, { flex: 3, align: 'start' }),
      wrapedText('x' + count, { flex: 1, align: 'end' }),
      ...(i % 2 === 0 ? [wrapedText(' ', { flex: 1, align: 'end' })] : [])
    ],
    [] as Payload[]
  );

  if (entries.length % 2 !== 0) {
    charactersRows.push(wrapedText(' ', { flex: 3, align: 'start' }), wrapedText(' ', { flex: 1, align: 'end' }));
  }

  return tableMessage({
    title: [wrapAndCenterText(t(`StartBoard`))],
    rows: [
      [wrapAndCenterText(t(`StartBoardCharacters`))],
      ...chunk(charactersRows, 5),
      [wrapedText(t(`StartBoardDesc`, t('MyCharacter')))],
      [wrapedText(t(`StartBoardDesc2`, t('NextShort'), t(`Skip`)))],
      [wrapAndCenterText(t(`Friendship`))]
    ],
    buttons: [primaryButton(sendTextToBot(t(`MyCharacter`)))]
  });
}

export function myCharacter(character: Character) {
  const iamCmd = t('Iam', character.name);

  if (character instanceof Villager) {
    return t('YouAreVillager');
  }

  return tableMessage({
    title: [centeredText(t('YourCharacter'))],
    rows: [[wrapedText(t('YourCharacter', character.type))]],
    buttons: [
      primaryButton(messageAction(iamCmd)),
      secondaryButton(uriAction(t('CharacterIntroButton'), `https://chatbot-games.vercel.app/docs/werewolf/characters`))
    ]
  });
}

function _night(text: string[], command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t('NightBoard'))],
    rows: text.map(t => [wrapAndCenterText(t, { lineSpacing: `5px` })]),
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

function _light(text: string[], command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t(`DaytimeBoard`))],
    rows: text.map(t => [wrapAndCenterText(t, { lineSpacing: `5px` })]),
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function werewolfGroup() {
  return _night([t(`WerewolfDM`)], t(`IamWerewolf`));
}

export function guardGroup() {
  return _night([t(`GuardDM`)], t(`IamGuard`));
}

export function witcherGroup() {
  return _night([t(`WitcherDM`)], t(`IamWitcher`));
}

export function predictorGroup() {
  return _night([t(`PredictorDM`)], t(`IamPredictor`));
}

export function hunterGroup() {
  return _light([t(`HunterBoardSubtitle`), t(`HunterDM`)], t(`IamHunter`));
}

export function daytime(stage: Stage) {
  const names = stage.death.map(survivor => survivor.nickname);
  if (names.length) {
    return playerList({
      names,
      title: [centeredText(t(`DaytimeBoard`))],
      footer: [centeredText(t('SilenceForTheDeceased'))]
    });
  } else {
    return _light([t(`NoOneDead`)]);
  }
}

export function vote(game: Game) {
  const { stage } = game;
  if (!(stage instanceof VoteBaseStage)) return null;

  return tableMessage({
    title: [
      wrapAndCenterText(t(`VoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: Array.from(stage.candidates, ([id, list]): Payload[] => {
      const name = game.getPlayer(id).nickname;
      return [
        wrapedText(name, { flex: 9, action: messageAction(t.regex(`Vote`, name)) }),
        createFlexText({ flex: 0, align: 'end' })(String(list.length))
      ];
    }),
    buttons: [primaryButton(messageAction(t(`WhoNotVoted`))), secondaryButton(messageAction(t(`Waive`)))]
  });
}

export function revote(game: Game) {
  const { stage } = game;
  if (!(stage instanceof VoteBaseStage)) return null;

  return tableMessage({
    title: [
      wrapAndCenterText(t(`ReVoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: Array.from(stage.candidates, ([id, list]): Payload[] => {
      const name = game.getPlayer(id).nickname;
      return [
        wrapedText(name, { flex: 9, action: messageAction(t.regex(`Vote`, name)) }),
        createFlexText({ flex: 0, align: 'end' })(String(list.length))
      ];
    }),
    footer: [wrapedText(t(`ReVoteBoardFooter`))],
    buttons: [primaryButton(messageAction(t(`WhoNotVoted`))), secondaryButton(messageAction(t(`Waive`)))]
  });
}

export function voted(stage: Stage) {
  const names = stage.death.map(character => character.nickname);
  return tableMessage({
    title: [centeredText(t(`VoteEndBoard`))],
    rows: [[names.length ? wrapAndCenterText(t(`Banishment`, names.join(', '))) : wrapAndCenterText(t(`NoOneDead`))]]
  });
}

function playerList({ title = [], names, action, buttons, footer }: PlayerListProps) {
  return tableMessage({
    title,
    rows: names.map((name, idx) => [
      wrapedText(`${idx + 1}.`, { flex: 0, align: 'start' }),
      wrapedText(`${name}`, {
        flex: 9,
        align: 'start',
        margin: 'md',
        action: action && action(name)
      })
    ]),
    buttons,
    footer
  });
}

export function werewolf(game: Game, werewolfId: string) {
  const names = game.stage.survivors.reduce(
    (names, player) => (werewolfId === player.id ? names : [...names, player.nickname]),
    [] as string[]
  );

  return playerList({
    names,
    title: [centeredText(t(`ClickToSelect`))],
    action: name => messageAction(t.regex(`Kill`, name)),
    buttons: [primaryButton(messageAction(t('Idle'))), secondaryButton(messageAction(t('Suicide')))]
  });
}

export function werewolves(game: Game, werewolfId: string) {
  const names = game.stage.survivors.reduce(
    (names, player) => (werewolfId !== player.id && player instanceof Werewolf ? names : [...names, player.nickname]),
    [] as string[]
  );

  return playerList({
    names,
    title: [centeredText(t(`WerewolvesBoard`))],
    footer: [wrapedText(t(`WerewolvesBoardDesc`))],
    buttons: [
      primaryButton(liffAction(t('ChatRoom'), `/chat/${game.chat}`)),
      secondaryButton(postBackTextAction(t(`WerewolfControlPanel`)))
    ]
  });
}

export function guard(game: Game, guardId: string) {
  const names = game.stage.survivors.reduce(
    (names, player) => (guardId === player.id ? names : [...names, player.nickname]),
    [] as string[]
  );
  return playerList({
    names,
    title: [centeredText(t(`GuardBoard`))],
    action: name => messageAction(t.regex(`Protect`, name)),
    buttons: [primaryButton(messageAction(t('ProtectSelf'))), secondaryButton(messageAction(t(`NoProtect`)))]
  });
}

export function predictor(game: Game, predictorId: string) {
  const predictor = game.getPlayer<Predictor>(predictorId);
  return tableMessage({
    title: [wrapAndCenterText(t(`PredictorBoard`))],
    rows: [
      ...game.stage.survivors
        .map(c => {
          if (predictor.id === c.id) return [];
          const predictText = t.regex(`Predict`, c.nickname);
          const predicted = predictor.predicted.includes(c.id);
          const action = predicted ? undefined : messageAction(predictText);
          const title = predicted ? t(c.good ? `PredictedGoodGuy` : `PredictedBadGuy`) : '？？？';
          return [
            wrapedText(`【${title}】`, { flex: 0, align: 'start', action }),
            wrapedText(`${c.nickname}`, { flex: 9, align: 'start', action })
          ];
        })
        .filter(r => !!r.length)
    ],
    footer: predictor.predictedAll ? [wrapedText(t('PredictedAll'))] : []
  });
}

export function rescue(stage: Stage) {
  const nearDeath = stage.nearDeath.map(character => character.nickname);

  if (!nearDeath.length) {
    return tableMessage({
      rows: [[wrapAndCenterText(t(`NoOneHurt`))]],
      buttons: [primaryButton(messageAction(t(`ShowPoisonBoard`))), secondaryButton(messageAction(t(`NotUseMedicine`)))]
    });
  }

  return playerList({
    names: nearDeath,
    title: [centeredText(t(`RescueBoard`))],
    action: name => messageAction(t.regex(`Rescue`, name)),
    buttons: [primaryButton(messageAction(t(`ShowPoisonBoard`))), secondaryButton(messageAction(t(`NotUseMedicine`)))]
  });
}

export function poison(stage: Stage, witcherId: string) {
  const names = stage.survivors.reduce(
    (res, survivor) => (survivor.id === witcherId ? res : [...res, survivor.nickname]),
    [] as string[]
  );
  return playerList({
    names,
    title: [centeredText(t(`PoisonBoard`))],
    action: name => messageAction(t.regex(`Poison`, name)),
    buttons: [primaryButton(messageAction(t(`ShowRescueBoard`))), secondaryButton(messageAction(t(`NotUseMedicine`)))]
  });
}

export function hunter(game: Game, hunterId: string) {
  const names = game.stage.survivors.reduce(
    (res, survivor) => (survivor.id === hunterId ? res : [...res, survivor.nickname]),
    [] as string[]
  );
  return playerList({
    names,
    title: [centeredText(t(`HunterBoard`))],
    action: name => messageAction(t.regex(`Shoot`, name)),
    buttons: [secondaryButton(messageAction(t(`NoShoot`)))]
  });
}

export function hunterEnd(stage: Stage) {
  if (!(stage instanceof HunterEnd)) return null;

  if (stage.shot.length) {
    return playerList({
      names: stage.shot.map(id => stage.players.get(id)!.nickname),
      title: [wrapAndCenterText(stage.shot.map(() => t(`ShootingSound`) + '!').join(''))],
      footer: [centeredText(t('SilenceForTheDeceased'))]
    });
  }

  return _light([t(`NoOneWasShot`)]);
}

export function notVoted(stage: Stage) {
  if (stage instanceof VoteBaseStage) {
    const names = stage.voter.filter(id => !stage.voted.includes(id)).map(id => stage.players.get(id)!.nickname);
    if (!names.length) return;
    return playerList({
      names,
      title: [wrapAndCenterText(t(`WhoNotVoted`))]
    });
  }
}

export function survivors(stage: Stage) {
  const names = stage.survivors.map(survivor => survivor.nickname);
  return playerList({
    names,
    title: [wrapAndCenterText(t(`Survivors`))]
  });
}

export function end(stage: Stage) {
  if (!(stage instanceof End)) return null;
  const text = stage.getEndMessage();
  return tableMessage({
    title: [wrapAndCenterText(t.raw(`End`)[0])],
    rows: [[wrapedText(text, { align: text.length > 18 ? 'start' : 'center' })]],
    buttons: [primaryButton(messageAction(t('DeathReport'))), secondaryButton(messageAction(t.raw(`End`)[0]))]
  });
}

export function ended() {
  return tableMessage({
    title: [wrapAndCenterText(t.raw(`End`)[0])],
    rows: [],
    buttons: [primaryButton(messageAction(t.raw(`Initiate`)[0]))]
  });
}
