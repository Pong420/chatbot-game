/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TextMessage,
  TextEventMessage,
  MessageEvent,
  EventSource,
  Group,
  User,
  PostbackEvent,
  WebhookEvent
} from '@line/bot-sdk';
import './mockClient';

function createText(text: string) {
  return { text, type: 'text' } satisfies TextMessage;
}

function createMessage(text: string, mentionees?: string[]): TextEventMessage {
  return {
    ...createText(text),
    ...(mentionees && {
      mention: {
        mentionees: mentionees.map((userId, index) => ({
          index,
          userId,
          type: 'user',
          length: mentionees.length
        }))
      }
    }),
    quoteToken: 'quoteToken',
    id: String(Date.now())
  };
}

function createTextMessageEvent<S extends EventSource>(
  text: string,
  source: S,
  mentionees?: string[]
): MessageEvent & { source: S } {
  return {
    mode: 'active',
    type: 'message',
    message: createMessage(text, mentionees),
    replyToken: String(Date.now()),
    timestamp: Date.now(),
    source: source,
    webhookEventId: 'webhookEventId',
    deliveryContext: { isRedelivery: false }
  };
}

function createPostbackTextEvent<S extends EventSource>(text: string, source: S): PostbackEvent & { source: S } {
  return {
    mode: 'active',
    type: 'postback',
    postback: {
      data: JSON.stringify({ text })
    },
    replyToken: String(Date.now()),
    timestamp: Date.now(),
    source: source,
    webhookEventId: 'webhookEventId',
    deliveryContext: { isRedelivery: false }
  };
}

export interface MessageOptions {
  userId?: string;
  groupId?: string;
  postback?: boolean;
  mentionees?: string[];
}

export function createSingleTextMessage(
  text: string,
  options: MessageOptions & { postback: true }
): PostbackEvent & { source: User };
export function createSingleTextMessage(
  text: string,
  options: MessageOptions & { postback?: boolean }
): MessageEvent & { source: User };
export function createSingleTextMessage(text: string, options?: MessageOptions) {
  const { userId = 'userId', postback, mentionees } = options || {};
  const source: User = { type: 'user', userId };
  return postback ? createPostbackTextEvent(text, source) : createTextMessageEvent(text, source, mentionees);
}

export function createGroupTextMessage(
  text: string,
  options: MessageOptions & { postback: true }
): PostbackEvent & { source: Group };
export function createGroupTextMessage(
  text: string,
  options?: MessageOptions & { postback?: boolean }
): MessageEvent & { source: Group };
export function createGroupTextMessage(text: string, options?: MessageOptions) {
  const { userId = 'userId', groupId = 'groupId', postback, mentionees } = options || {};
  const source: Group = { userId, groupId, type: 'group' };
  return postback ? createPostbackTextEvent(text, source) : createTextMessageEvent(text, source, mentionees);
}

export function createMemeberJoinedEvent() {
  return {
    type: 'memberJoined',
    joined: { members: [] },
    mode: 'active',
    timestamp: Date.now(),
    source: { type: 'group', groupId: '' },
    webhookEventId: 'webhookEventId',
    deliveryContext: { isRedelivery: false },
    replyToken: String(Date.now())
  } satisfies WebhookEvent;
}
