import { t } from '@line/locales';
import { getUser } from '@line/utils/userService';
import { createFilter } from '@line/filter';

export const UserId = ({ warning = true } = {}) =>
  createFilter(event => {
    const userId = event.source.userId;
    if (userId) return userId;
    if (warning) return t('GetUserIdFailed');
  });

export const User = () => createFilter(UserId(), async (userId, event) => getUser(event, userId));
