/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, WebhookEvent } from '@line/bot-sdk';
import { client } from './client';
import { textMessage } from './utils/createMessage';

type Output = void | undefined | null | string | Message | Message[];

export interface Handler {
  (event: WebhookEvent): Output | Promise<Output>;
}

type FilterArg<T> = Exclude<Awaited<T>, undefined | null | typeof PASS | typeof SKIP>;
type WebhookFunction = (event: WebhookEvent) => any;

type ExtractReturnType<T extends readonly unknown[]> = T extends [infer F, ...infer R]
  ? F extends WebhookFunction
    ? FilterArg<ReturnType<F>> extends never
      ? [...ExtractReturnType<R>]
      : [FilterArg<ReturnType<F>>, ...ExtractReturnType<R>]
    : ExtractReturnType<R>
  : [];

export type WebhookFunctionsArray = ReadonlyArray<WebhookFunction>;
type Callback<WebhookFunctions extends WebhookFunctionsArray> = (
  ...args: [...ExtractReturnType<WebhookFunctions>, WebhookEvent]
) => ReturnType<Handler>;

export type { WebhookEvent };

export const PASS = Symbol('PASS');
export const SKIP = Symbol('SKIP'); // skip error

export function createHandler<WebhookFunctions extends WebhookFunctionsArray>(
  ...payload: [...WebhookFunctions, Callback<WebhookFunctions>]
) {
  return async (event: WebhookEvent): Promise<Output> => {
    const callback = payload.slice(-1)[0] as Callback<WebhookFunctions>;
    const selectors = payload.slice(0, -1) as unknown as WebhookFunctions;
    const res = await Promise.all(
      selectors.map(async selector => {
        const arg = await selector(event);
        if (typeof arg === 'undefined' || arg === null) throw SKIP;
        return arg;
      })
    )
      .then(args => {
        args = args.filter(a => !!a && a !== PASS && a !== SKIP);
        return callback(...(args as ExtractReturnType<WebhookFunctions>), event);
      })
      .catch(error => {
        if (error === SKIP) return;
        if (typeof error === 'string') return error; // as error message will reply to user
        // ignore other type of error
        process.env.NODE_ENV === 'production' && console.warn('Except error to be string but receive', error);
      });

    return res;
  };
}

export function createEventHandler(...payload: Handler[][]) {
  const handlers = payload.flat();

  return async function (event: WebhookEvent) {
    for (const handler of handlers) {
      if ('replyToken' in event) {
        const message = await handler(event);
        if (message) {
          return client.replyMessage({
            replyToken: event.replyToken,
            messages:
              typeof message === 'string' ? [textMessage(message)] : Array.isArray(message) ? message : [message],
            notificationDisabled: true
          });
        }
      }
    }
  };
}
