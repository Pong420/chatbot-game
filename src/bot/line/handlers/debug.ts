import { createHandler } from '@line/handler';
import { GroupId, TextEqual, UserId } from '@line/filter';
import { t } from '@line/locales';

export default [
  createHandler(GroupId, TextEqual(t('GroupId')), groupId => t(`GroupIdResp`, groupId)),
  createHandler(UserId, TextEqual(t('GetUserId')), userId => t(`GetUserIdResp`, userId))
];
