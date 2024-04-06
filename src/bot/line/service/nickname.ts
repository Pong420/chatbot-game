import { createHandler } from '../handler';
import { TextEqual, TextMatch, User, UserId } from '../filter';
import { t } from '../messages';
import { setNickname, maxLength } from '../utils/user';
import { centeredText, createTableMessage } from '../utils/createTableMessage';
import { orderList } from '../utils/createMessage';

export const crearteIntroContent = () =>
  createTableMessage({
    fillCol: 0,
    title: [centeredText(t('NickNameIntro'))],
    rows: orderList(t.paragraph('NickNameIntroResp', t('MyNickName'), maxLength))
  });

export const nicknameHandlers = [
  createHandler(TextEqual(t('NickNameIntro')), crearteIntroContent),
  createHandler(TextEqual(t('MyNickName')), User(), user => user.nickname),
  createHandler(UserId(), TextMatch(t('SetNickName')), (_userId, [, nickname], event) => setNickname(event, nickname))
];
