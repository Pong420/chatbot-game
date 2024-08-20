import { WebhookEvent } from '@line/bot-sdk';
import { t } from '@line/locales';
import { getUser } from '@line/utils/userService';
import { createFilter } from '@line/filter';

/**
 * Not sure the reason, cannot get the userId for some users, so we need the filter
 */
export const UserId = (event: WebhookEvent) => {
  if (event.type === 'message' || event.type === 'postback') {
    const userId = event.source.userId;
    if (!userId) throw t('GetUserIdFailed');
    return userId;
  }

  if (event.type === 'memberJoined') {
    const users = event.joined.members;
    if (users.length === 1) {
      return users[0].userId;
    }
  }
};

export const User = createFilter(
  UserId,
  (event: WebhookEvent) => event,
  async (userId, event) => getUser(event, userId)
);
