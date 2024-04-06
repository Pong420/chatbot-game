import { createHandler } from '../handler';
import { Group, TextEqual } from '../filter';
import { t } from '../messages';

export const debugHandlers = [
  createHandler(Group, TextEqual(t('GetGroupID')), event => t(`GetGroupIDResp`, event.source.groupId)),
  createHandler(
    event => event.source.userId || '???',
    TextEqual(t('GetUserID')),
    userId => t(`GetUserIDResp`, userId)
  )
];
