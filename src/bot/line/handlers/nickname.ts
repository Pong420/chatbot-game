import { createHandler } from '@line/handler';
import { TextEqual, TextMatch, User, UserId } from '@line/filter';
import { setNickname, maxLength } from '@line/utils/userService';
import { orderList, centeredText, createTableMessage } from '@line/utils/createMessage';
import { t } from '@line/locales';

export const crearteIntroContent = () =>
  createTableMessage({
    fillCol: 0,
    title: [centeredText(t('NickNameIntro'))],
    rows: orderList(t.paragraph('NickNameIntroResp', t('MyNickName'), maxLength))
  });

export const nicknameHandlers = [
  createHandler(TextEqual(t('NickNameIntro')), crearteIntroContent),
  createHandler(TextEqual(t('MyNickName')), User, user => user.nickname),
  createHandler(UserId, TextMatch(t('SetNickName')), (_, [, nickname], event) => setNickname(event, nickname))
];
