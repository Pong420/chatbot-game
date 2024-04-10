import { Action } from '@line/bot-sdk';
import { Character, Villager } from '@werewolf/character';
import { t } from '@werewolf/locales';
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
import { Werewolf } from '@werewolf/game';

interface PlayerListProps {
  names: string[];
  title?: CreateTableMessageProps['title'];
  buttons?: CreateTableMessageProps['buttons'];
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

export function night(text: string, command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t('NightBoard'))],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function daytime(text: string, command?: string) {
  return tableMessage({
    title: [wrapAndCenterText(t(`DaytimeBoard`))],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function voting(votes: Record<string, Character[]>, count: number) {
  const entries = Object.entries(votes);
  const rows = entries.map<Payload[]>(([name, list]) => {
    return [
      wrapedText(name, { flex: 9, action: messageAction(t(`Vote`, name)) }),
      createFlexText({ flex: 0, align: 'end' })(String(list.length))
    ];
  });

  return tableMessage({
    title: [wrapAndCenterText(t(`VoteBoard`, count, entries.length)), wrapAndCenterText(t(`ClickToVote`))],
    rows: rows,
    buttons: [primaryButton(messageAction(t(`WhoNotVoted`))), secondaryButton(messageAction(t(`Waive`)))]
  });
}

export function voted(text: string) {
  return tableMessage({
    title: [centeredText(t(`VoteEndBoard`))],
    rows: [[wrapAndCenterText(text)]]
  });
}

function playerList({ title = [], names, action, buttons }: PlayerListProps) {
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
    buttons
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
    buttons: [
      primaryButton(messageAction(t('Idle'))),
      // TODO:
      secondaryButton(messageAction(t('Suicide'), `請再輸入「${t('Suicide')}」確認`))
    ]
  });
}
