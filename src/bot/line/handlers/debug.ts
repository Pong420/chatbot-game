import { createHandler, WebhookEvent } from '../handler';
import { Group, TextEqual } from '../filter';
import { t } from '../locales';

const getUserId = (event: WebhookEvent) => event.source.userId || '???';

export const debugHandlers = [
  createHandler(Group, TextEqual(t('GetGroupID')), event => t(`GetGroupIDResp`, event.source.groupId)),
  createHandler(getUserId, TextEqual(t('GetUserID')), userId => t(`GetUserIDResp`, userId))
];
