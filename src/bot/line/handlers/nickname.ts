import { WebhookEvent } from '@line/bot-sdk';
import { createHandler } from '@line/handler';
import { TextEqual, TextMatch, User, UserId } from '@line/filter';
import { setNickname } from '@line/utils/userService';
import { t } from '@line/locales';

export const nicknameHandlers = [
  createHandler(TextEqual(t('MyNickName')), User, user => user.nickname),
  createHandler(
    UserId,
    TextMatch(t('SetNickName')),
    (event: WebhookEvent) => event,
    (_, [, nickname], event) => setNickname(event, nickname)
  )
];

export default nicknameHandlers;
