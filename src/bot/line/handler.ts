import { Message, WebhookEvent } from '@line/bot-sdk';
import { client } from './client';
import { textMessage } from './utils/createMessage';
import { createFilter, FilterFunction, OutputFunction } from './filter';

export type Result = void | undefined | null | string | Message | Message[];

export type Handler = ReturnType<typeof createHandler>;

export function createHandler<FilterFunctions extends FilterFunction[]>(
  ...filters: [...FilterFunctions, OutputFunction<FilterFunctions, Result | Promise<Result>>]
) {
  return async (event: WebhookEvent) => {
    const output = createFilter(...filters);
    return output(event).catch(error => {
      if (!error) return;
      if (typeof error === 'string') return error; // as error message will reply to user
      if (error instanceof Error) {
        if (process.env.NODE_ENV !== 'test') console.error(error);
        return error.message;
      }
      // ignore other type of error
      process.env.NODE_ENV !== 'test' && console.warn('Expect error to be string or Error, but receive', error);
    });
  };
}

export function createEventHandler(...payload: Handler[][]) {
  const handlers = payload.flat();
  return async function (event: WebhookEvent) {
    if (!('replyToken' in event)) return;

    for (const handler of handlers) {
      const message = await handler(event);
      if (message) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: typeof message === 'string' ? [textMessage(message)] : Array.isArray(message) ? message : [message],
          notificationDisabled: true
        });
      }
    }
  };
}
