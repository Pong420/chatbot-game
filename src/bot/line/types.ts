import { EventBase, MessageEvent, TextEventMessage, WebhookEvent, Group, User, PostbackEvent } from '@line/bot-sdk';

export type TextMessageEvent = MessageEvent & { message: TextEventMessage };
export type GroupWebhookEvent = WebhookEvent & { source: Group };
export type SingleWebhookEvent = WebhookEvent & { source: User };

export const isGroupEvent = <T extends EventBase>(event: T): event is T & { source: Group } =>
  event.source.type === 'group';

export const isSingleEvent = <T extends EventBase>(event: T): event is T & { source: User } =>
  event.source.type === 'user';

export function isMessage(event: WebhookEvent): event is MessageEvent {
  return event.type === 'message';
}

export function isTextMessage(event: WebhookEvent): event is TextMessageEvent {
  return isMessage(event) && event.message.type === 'text';
}

export const isPostBackEvent = (event: WebhookEvent): event is PostbackEvent => event.type === 'postback';

export function getPostBackText(event: PostbackEvent): string {
  try {
    const { text } = JSON.parse(event.postback.data);
    return text;
  } catch {}
  return '';
}
