/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';

type Filtered<T> = Exclude<Awaited<T>, undefined | null | boolean>;
export type FilterFunction = (event: WebhookEvent) => any;
export type OutputFunction<FilterFunctions extends FilterFunction[], R> = (
  ...args: [...ExtractReturnType<FilterFunctions>, WebhookEvent]
) => R;

export type ExtractReturnType<T extends readonly unknown[]> = T extends [infer F, ...infer R]
  ? F extends FilterFunction
    ? Filtered<ReturnType<F>> extends never
      ? [...ExtractReturnType<R>]
      : [Filtered<ReturnType<F>>, ...ExtractReturnType<R>]
    : ExtractReturnType<R>
  : [];

/**
 * Filter rule:
 *
 * To stop the following filters or output function
 *  1. return false, no message will return to user
 *  2. return a string / Message / Message[] will reply to user ( handled by handler.ts )
 *  3. throw a false or string or Error will reply to user ( handled by handler.ts )
 *
 * `undefined`, `null`, `true` will not appield to the argument of output function, see the type `Filtered`
 */
export function createFilter<FilterFunctions extends FilterFunction[], R>(
  ...payload: [...FilterFunctions, OutputFunction<FilterFunctions, R>]
) {
  return async (event: WebhookEvent) => {
    const args: unknown[] = [];
    const filters = payload.slice(0, -1) as unknown as FilterFunctions;
    const output = payload.slice(-1)[0] as OutputFunction<FilterFunctions, R>;

    for (const filter of filters) {
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
