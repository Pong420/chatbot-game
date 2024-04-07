import { WebhookEvent } from '@line/bot-sdk';
import { client } from '@line/client';

export async function getUserProfile(event: WebhookEvent | null, userId = event?.source.userId) {
  if (userId) {
    switch (event?.source.type) {
      case 'group':
        return client.getGroupMemberProfile(event.source.groupId, userId);
      case 'room':
        return client.getRoomMemberProfile(event.source.roomId, userId);
      default:
        return client.getProfile(userId);
    }
  }
}
