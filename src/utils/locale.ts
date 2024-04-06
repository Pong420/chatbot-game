/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomOption } from '@/utils/random';

export const locale = process.env.LOCALE;

export function createTranslateFunction<O extends Record<string, string | string[]>>(...payload: { default: O }[]) {
  const messages = payload.reduce((messages, o) => ({ ...messages, ...o }), {}) as O;
  const t = (key: keyof O, ...args: any[]) => {
    /**
     * TODO: refactor, create a custom mactchers instead
     */
    if (process.env.NODE_ENV === 'test') return key as string;

    const payload: string | string[] = messages[key];
    let text = Array.isArray(payload) ? (payload.length === 1 ? payload[0] : randomOption(payload)) : payload;
    args.forEach((a, i) => {
      text = text.replace(`{${i}}`, a);
    });
    return text;
  };

  t.paragraph = function (key: keyof O, ...args: any[]) {
    const content = t(key, ...args);
    return content
      .trim()
      .split('\n')
      .map(t => t.trim());
  };

  return { t, messages };
}
