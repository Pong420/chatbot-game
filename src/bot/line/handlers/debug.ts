import { createHandler, WebhookEvent } from '../handler';
import { Group, TextEqual } from '../filter';
import { t } from '../locales';

const getUserId = (event: WebhookEvent) => event.source.userId || '???';

export const debugHandlers = [
  createHandler(Group, TextEqual(t('GroupId')), event => t(`GroupIdResp`, event.source.groupId)),
  createHandler(getUserId, TextEqual(t('GetUserId')), userId => t(`GetUserIdResp`, userId))
];
