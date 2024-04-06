import { randomOption } from '@/utils/random';

export const locale = process.env.LOCALE;

export function createTranslateFunction<O extends Record<string, string | string[]>>(...payload: { default: O }[]) {
  const messages = payload.reduce((messages, o) => ({ ...messages, ...o.default }), {}) as O;
  const t = (key: keyof O, ...args: (string | number)[]) => {
    const payload: string | string[] = messages[key];
    let text = Array.isArray(payload)
      ? payload.length === 1 || process.env.NODE_ENV === 'test'
        ? payload[0]
        : randomOption(payload)
      : payload;

    args.forEach((a, i) => {
      text = text.replaceAll(`{${i}}`, String(a));
    });

    return text;
  };

  t.paragraph = function (key: keyof O, ...args: (string | number)[]) {
    const content = t(key, ...args);
    return content
      .trim()
      .split('\n')
      .map(t => t.trim());
  };

  return { t, messages };
}
