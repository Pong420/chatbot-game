import { WebhookEvent } from '@line/bot-sdk';
import { t } from '@line/locales';
import { getUser } from '@line/utils/userService';
import { createFilter } from '@line/filter';

/**
 * Not sure the reason, cannot get the userId for some users, so we need the filter
 */
export const UserId = (event: WebhookEvent) => {
  const userId = event.source.userId;
  if (
    event.type === 'message' ||
    event.type === 'postback' ||
    event.type === 'memberJoined' ||
    event.type === 'memberLeft'
  ) {
    if (!userId) throw t('GetUserIdFailed');
    return userId;
  }
};

export const User = createFilter(
  UserId,
  (event: WebhookEvent) => event,
  async (userId, event) => getUser(event, userId)
);
