import { Character } from '@werewolf/character';
import { t } from '@werewolf/locales';
import {
  textMessage,
  messageAction,
  sendTextToBot,
  primaryButton,
  secondaryButton,
  postBackTextAction,
  orderList,
  createTableMessage,
  CreateTableMessageProps,
  wrapAndCenterText,
  centeredText,
  wrapedText,
  createFlexText,
  Payload
} from '@line/utils/createMessage';

export function tableMessage({ title = [], ...props }: CreateTableMessageProps) {
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
    title: [centeredText(`參賽者`)],
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