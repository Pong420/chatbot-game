/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, WebhookEvent } from '@line/bot-sdk';
import { AnyFunction } from '@/types';

type Output = void | undefined | null | string | Message | Message[];

export interface Handler {
  (event: WebhookEvent): Output | Promise<Output>;
}

type FilterArg<T> = Exclude<T, undefined | null | typeof IGNORE>;

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

export const IGNORE = Symbol('IGNORE');

export function createFilter<R>(callback: (event: WebhookEvent) => R | boolean) {
  return function (event: WebhookEvent) {
    const res = callback(event);
    if (res === false) throw IGNORE;
    if (res === true) return;
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
        return arg;
      })
    )
      .then(args => {
        args = args.filter(Boolean);
        return callback(...(args as ExtractReturnType<AnyFunctions>), event);
      })
      .catch(_error => {
        // TODO: error instanceof LineMessageError
      });

    return res;
  };
}
