import { t } from '@line/locales';
import { getUser } from '@line/utils/userService';
import { createFilter } from '@line/filter';

export const UserId = createFilter(event => {
  const userId = event.source.userId;
  if (!userId) throw t('GetUserIdFailed');
  return userId;
});

export const User = createFilter(UserId, async (userId, event) => getUser(event, userId));
