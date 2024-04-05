/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, WebhookEvent } from '@line/bot-sdk';
import { AnyFunction } from '@/types';
import { client } from './client';
import { textMessage } from './utils/createMessage';

type Output = void | undefined | null | string | Message | Message[];

export interface Handler {
  (event: WebhookEvent): Output | Promise<Output>;
}

type FilterArg<T> = Exclude<T, undefined | null | typeof SKIP>;

type ExtractReturnType<T extends readonly unknown[]> = T extends [infer F, ...infer R]
  ? F extends AnyFunction
    ? FilterArg<ReturnType<F>> extends never
      ? [...ExtractReturnType<R>]
      : [FilterArg<ReturnType<F>>, ...ExtractReturnType<R>]
    : ExtractReturnType<R>
  : [];

export type AnyFunctionArray = ReadonlyArray<AnyFunction>;
type Callback<AnyFunctions extends AnyFunctionArray> = (
  ...args: [...ExtractReturnType<AnyFunctions>, WebhookEvent]
) => ReturnType<Handler>;

export type { WebhookEvent };

export const SKIP = Symbol('SKIP');

export function createFilter<R>(callback: (event: WebhookEvent) => R | boolean) {
  return function (event: WebhookEvent) {
    const res = callback(event);
    if (res === false) throw SKIP;
    if (res === true) return SKIP;
    return res as Exclude<R, boolean>;
  };
}

export function createHandler<AnyFunctions extends AnyFunctionArray>(
  ...payload: [...AnyFunctions, Callback<AnyFunctions>]
) {
  return async (event: WebhookEvent): Promise<Output> => {
    const callback = payload.slice(-1)[0] as Callback<AnyFunctions>;
    const selectors = payload.slice(0, -1) as unknown as AnyFunctions;
    const res = await Promise.all(
      selectors.map(async selector => {
        const arg = await selector(event);
        if (typeof arg === 'undefined') throw SKIP;
        return arg;
      })
    )
      .then(args => {
        args = args.filter(a => !!a && a !== SKIP);
        return callback(...(args as ExtractReturnType<AnyFunctions>), event);
      })
      .catch(_error => {
        // TODO: error instanceof LineMessageError
      });

    return res;
  };
}

export function createEventHandler(handlers: Handler[]) {
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
