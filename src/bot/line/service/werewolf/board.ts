import { Action } from '@line/bot-sdk';
import { t } from '@werewolf/locales';
import { Werewolf } from '@werewolf/game';
import { Stage, VoteBaseStage, HunterEnd, End, Start } from '@werewolf/stage';
import { Character, Predictor, Villager } from '@werewolf/character';
import {
  messageAction,
  sendTextToBot,
  primaryButton,
  secondaryButton,
  orderList,
  createTableMessage,
  CreateTableMessageProps,
  wrapAndCenterText,
  centeredText,
  wrapedText,
  createFlexText,
  Payload,
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

export function initiate(groupId: string) {
  return tableMessage({
    rows: orderList([t.paragraph('SettingsDesc')]),
    buttons: [
      primaryButton(messageAction(t(`UseDefaultSetup`), t(`SetupCompleted`))),
      secondaryButton(
        uriAction(
          t(`UseCustomSetup`),
          `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/werewolf/settings/${groupId}`
        )
      )
    ]
  });
}

export function start(stage: Stage) {
  if (!(stage instanceof Start)) throw new Error(`Invalid Stage`);

  const characters = stage.getCharacters().reduce(
    (res, Character) => {
      const k = new Character().name;
      return { ...res, [k]: (res[k] || 0) + 1 };
    },
    {} as Record<string, number>
  );

  const rows: Payload[][] = [];

  if (stage.customCharacters?.length) {
    rows.push([wrapAndCenterText(t(`AvailableCharacters`))]);

    for (const k in characters) {
      const count = characters[k];
      if (!count) continue;
      rows.push([wrapedText(k, { flex: 9 }), createFlexText({ flex: 0, align: 'end' })(String(count))]);
    }

    rows.push([wrapAndCenterText('---')]);
  } else {
    rows.push([wrapAndCenterText(t(`AvailableCharactersDefault`))]);
  }

  rows.push([
    wrapAndCenterText(
      t(stage.werewolvesKnowEachOthers ? `WerewolvesDontKnowEachOthers` : `WerewolvesDontKnowEachOthers`)
    )
  ]);
  rows.push([wrapAndCenterText(t(`Friendship`))]);

  return tableMessage({
    title: [centeredText(t(`StartBoard`))],
    rows: Array.from(stage.players, ([, player], idx) => {
      return [
        wrapedText(`${idx + 1}.`, { flex: 0, align: 'start' }),
        wrapedText(player.nickname, {
          align: 'start',
          margin: !!player.nickname ? 'none' : 'md'
        })
      ];
    }),
    buttons: [primaryButton(messageAction(t(`JoinButton`), t('Join')))]
  });
}

export function players(stage: Stage) {
  const buttons = [primaryButton(messageAction(t(`JoinButton`), t('Join')))];
  if ((stage.numOfPlayers === -1 && stage.players.size >= 6) || stage.players.size === stage.numOfPlayers) {
    if (stage.players.size >= 6) buttons.push(secondaryButton(messageAction(t('StartButton'), t('Start'))));
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

export function myCharacter(character: Character) {
  const iamCmd = t('Iam', character.name);
  const introCmd = t('CharacterIntro', character.name);

  if (character instanceof Villager) {
    return t('YouAreVillager');
  }

  return tableMessage({
    title: [centeredText(t('YourCharacter'))],
    rows: [[wrapedText(t('YourCharacter', character.type))]],
    buttons: [primaryButton(messageAction(iamCmd)), secondaryButton(messageAction(t('CharacterIntroButton'), introCmd))]
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

export function vote(stage: Stage) {
  if (!(stage instanceof VoteBaseStage)) return null;

  return tableMessage({
    title: [
      wrapAndCenterText(t(`VoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: Array.from(stage.candidates, ([name, list]): Payload[] => {
      return [
        wrapedText(name, { flex: 9, action: messageAction(t.regex(`Vote`, name)) }),
        createFlexText({ flex: 0, align: 'end' })(String(list.length))
      ];
    }),
    buttons: [primaryButton(messageAction(t(`WhoNotVoted`))), secondaryButton(messageAction(t(`Waive`)))]
  });
}

export function revote(stage: Stage) {
  if (!(stage instanceof VoteBaseStage)) return null;

  return tableMessage({
    title: [
      wrapAndCenterText(t(`ReVoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: Array.from(stage.candidates, ([name, list]): Payload[] => {
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

export function werewolf(game: Werewolf, killerId: string) {
  const names = game.stage.survivors.reduce(
    (names, player) => (killerId === player.id ? names : [...names, player.nickname]),
    [] as string[]
  );

  return playerList({
    names,
    title: [centeredText(t(`ClickToSelect`))],
    action: name => messageAction(t.regex(`Kill`, name)),
    buttons: [primaryButton(messageAction(t('Idle'))), secondaryButton(messageAction(t('Suicide')))]
  });
}

export function guard(game: Werewolf, guardId: string) {
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

export function predictor(game: Werewolf, predictorId: string) {
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

export function hunter(stage: Stage, hunterId: string) {
  const names = stage.survivors.reduce(
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

export function ended(stage: Stage) {
  if (!(stage instanceof End)) return null;
  const text = stage.getEndMessage();
  return tableMessage({
    title: [wrapAndCenterText(t(`End`))],
    rows: [[wrapedText(text, { align: text.length > 18 ? 'start' : 'center' })]],
    buttons: [primaryButton(messageAction(t(`DeathReport`))), secondaryButton(messageAction(t(`Initiate`)))]
  });
}
