import { Action } from '@line/bot-sdk';
import { Character, Predictor, Villager } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { Werewolf } from '@werewolf/game';
import { Stage, VoteBaseStage } from '@werewolf/stage';
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
  postBackTextAction
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

const startButtons: CreateTableMessageProps['buttons'] = [
  primaryButton(messageAction(t(`JoinButton`), t('Join'))),
  secondaryButton(messageAction(t('StartButton'), t('Start')))
];

export function start() {
  return tableMessage({
    title: [centeredText(t('Tips'))],
    rows: orderList(t.paragraph('ShortIntro', t('HostCommands'))),
    buttons: startButtons
  });
}

export function players(players: Iterable<Character>) {
  return tableMessage({
    title: [centeredText(t(`Players`))],
    rows: Array.from(players, (user, idx) => {
      return [
        wrapedText(`${idx + 1}.`, { flex: 0, align: 'start' }),
        wrapedText(user.nickname, {
          align: 'start',
          margin: !!user.nickname ? 'none' : 'md'
        })
      ];
    }),
    buttons: startButtons
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

function _night(text: string, command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t('NightBoard'))],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

function _light(text: string, command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t(`DaytimeBoard`))],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function werewolfGroup() {
  return _night(t(`WerewolfDM`), t(`IamWerewolf`));
}

export function guardGroup() {
  return _night(t(`GuardDM`), t(`IamGuard`));
}

export function witcherGroup() {
  return _night(t(`WitcherDM`), t(`IamWitcher`));
}

export function predictorGroup() {
  return _night(t(`PredictorDM`), t(`IamPredictor`));
}

export function hunterGroup() {
  return _light(t(`HunterDM`), t(`IamHunter`));
}

export function daytime(stage: Stage) {
  const names = stage.death.map(survivor => survivor.nickname);
  if (names.length) {
    return playerList({
      names,
      title: [centeredText(t(`DaytimeBoard`)), centeredText(t(`SomeOneDead`))],
      footer: [centeredText(t('SilenceForTheDeceased'))]
    });
  } else {
    return _light(t(`NoOneDead`));
  }
}

export function vote(stage: VoteBaseStage) {
  const rows = Array.from(stage.candidates, ([name, list]): Payload[] => {
    return [
      wrapedText(name, { flex: 9, action: messageAction(t(`Vote`, name)) }),
      createFlexText({ flex: 0, align: 'end' })(String(list.length))
    ];
  });

  return tableMessage({
    title: [
      wrapAndCenterText(t(`VoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: rows,
    buttons: [primaryButton(messageAction(t(`WhoNotVoted`))), secondaryButton(messageAction(t(`Waive`)))]
  });
}

export function revote(stage: VoteBaseStage) {
  const rows = Array.from(stage.candidates, ([name, list]): Payload[] => {
    return [
      wrapedText(name, { flex: 9, action: messageAction(t(`Vote`, name)) }),
      createFlexText({ flex: 0, align: 'end' })(String(list.length))
    ];
  });

  return tableMessage({
    title: [
      wrapAndCenterText(t(`ReVoteBoard`, stage.voted.length, stage.voter.length)),
      wrapAndCenterText(t(`ClickToVote`))
    ],
    rows: rows,
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
    (names, player) => (killerId === player.id ? names : [...names, player.name]),
    [] as string[]
  );

  return playerList({
    names,
    title: [centeredText(t(`ClickToSelect`))],
    action: name => postBackTextAction(t.regex(`Kill`, name)),
    buttons: [primaryButton(messageAction(t('Idle'))), secondaryButton(messageAction(t('Suicide')))]
  });
}

export function guard(game: Werewolf) {
  const names = game.stage.survivors.map(survivor => survivor.nickname);
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
          const title = predicted ? t(c.good ? `PredictedGoodGuy` : `PredictedBadGuy`) : '???';
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
    buttons: [secondaryButton(messageAction(t(`ShowRescueBoard`))), secondaryButton(messageAction(t(`NotUseMedicine`)))]
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
