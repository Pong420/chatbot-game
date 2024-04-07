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
  Payload
} from '@line/utils/createMessage';

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

  if (character.type === Villager.type) {
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
    title: [wrapAndCenterText(`現在是晚上`)],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function daytime(text: string, command?: string) {
  return tableMessage({
    title: [wrapAndCenterText('現在是白天')],
    rows: [[wrapAndCenterText(text)]],
    buttons: command ? [primaryButton(sendTextToBot(command))] : undefined
  });
}

export function voting(votes: Record<string, Character[]>, count: number) {
  const entries = Object.entries(votes);
  const rows = entries.map<Payload[]>(([name, list]) => {
    return [
      wrapedText(name, { flex: 9, action: messageAction(`我投 ${name}`) }),
      createFlexText({ flex: 0, align: 'end' })(String(list.length))
    ];
  });

  return tableMessage({
    title: [wrapAndCenterText(`投票階段 ${count}/${entries.length}`), wrapAndCenterText(`點擊名稱即可進行投票`)],
    rows: rows,
    buttons: [
      // primaryButton(messageAction(WereWolfCommand.WhoNotVoted)),
      // secondaryButton(messageAction(WereWolfCommand.Waive))
    ]
  });
}

export function voted(text: string) {
  return tableMessage({
    title: [centeredText('投票結束')],
    rows: [[wrapAndCenterText(text)]]
  });
}
