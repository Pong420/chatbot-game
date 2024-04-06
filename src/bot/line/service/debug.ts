import { createHandler } from '../handler';
import { Group, TextEqual } from '../filter';
import { t } from '../messages';

export const debugHandlers = [
  createHandler(Group, TextEqual(t('GET_GROUP_ID')), event => t(`GET_GROUP_ID_RESP`, event.source.groupId)),
  createHandler(
    event => event.source.userId || '???',
    TextEqual(t('GET_USER_ID')),
    userId => t(`GET_USER_ID_RESP`, userId)
  )
];

export default debugHandlers;
