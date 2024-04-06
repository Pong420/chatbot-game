import { Message } from '@line/bot-sdk';
import { textMessage } from './utils/createMessage';

// FIXME:
const keys = ['CANNOT_GET_UER_ID', 'SYSTEM_ERROR'] as const;

export type LineBotErrorKey = (typeof keys)[number];

export class LineBotError extends Error {}

export class LineBotErrorMessage extends Error {
  msg: Message;

  constructor(message: LineBotErrorKey) {
    super();
    this.msg = textMessage(message);
  }
}
