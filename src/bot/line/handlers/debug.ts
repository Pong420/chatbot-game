import { createHandler } from '@line/handler';
import { Group, TextEqual, UserId } from '@line/filter';
import { t } from '@line/locales';

export const debugHandlers = [
  createHandler(Group, TextEqual(t('GroupId')), event => t(`GroupIdResp`, event.source.groupId)),
  createHandler(UserId(), TextEqual(t('GetUserId')), userId => t(`GetUserIdResp`, userId))
];
