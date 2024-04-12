/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';

type Filtered<T> = Exclude<Awaited<T>, undefined | null | boolean>;
export type FilterFunction = (event: WebhookEvent) => any;
export type FilterFunctionArray = ReadonlyArray<FilterFunction>;
export type OutputFunction<FilterFunctions extends FilterFunctionArray, R> = (
  ...args: [...ExtractReturnType<FilterFunctions>, event: WebhookEvent]
) => R;

export type ExtractReturnType<T extends readonly any[]> = T extends [infer F, ...infer R]
  ? F extends FilterFunction
    ? Filtered<ReturnType<F>> extends never
      ? [...ExtractReturnType<R>]
      : [Filtered<ReturnType<F>>, ...ExtractReturnType<R>]
    : ExtractReturnType<R>
  : [];

/**
 * Filter rule:
 *
 * `undefined`, `null`, `boolean` will not appield to the arguments of output function, see the type `Filtered`
 *
 * To stop the following filters or output function
 *  1. return false, no message will return to user,
 *  2. throw "false" almost the same as returen `false`, but the types may look better
 *  3. throw string or Error transform to message and reply to user ( handled by handler.ts )
 *
 */
export function createFilter<FilterFunctions extends FilterFunction[], R>(
  ...payload: [...FilterFunctions, OutputFunction<FilterFunctions, R>]
) {
  const filters = payload.slice(0, -1) as unknown as FilterFunctions;
  const output = payload.slice(-1)[0] as OutputFunction<FilterFunctions, R>;

  return async (event: WebhookEvent) => {
    const args: unknown[] = [];
    for (const filter of filters) {
      if (typeof filter !== 'function') continue;
      const arg = await filter(event);
      if (arg === false) throw void 0;
      if (arg !== null && typeof arg !== 'undefined' && arg !== true) args.push(arg);
    }
    return output(...(args as ExtractReturnType<FilterFunctions>), event);
  };
}

export * from './filters/event';
export * from './filters/game';
export * from './filters/text';
export * from './filters/user';
