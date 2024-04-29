import { UnionToIntercetion } from '@/types';
import { randomOption } from './random';

export const locale = process.env.LOCALE;

export function defineMessages<O extends Record<string, string | string[]>[]>(...payload: [...O]) {
  const result = {} as Record<string, string | string[]>;
  for (const obj of payload) {
    for (const k in obj) {
      const value = obj[k];
      result[k as keyof typeof result] = process.env.VSCODE_PID && Array.isArray(value) ? value[0] : value;
    }
  }
  return result as UnionToIntercetion<O[number]>;
}

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

    if (process.env.NODE_ENV === 'test') {
      const matches = text.match(/{\d+}/g);
      matches && console.warn('Translation missing data:', text);
    }

    return text;
  };

  t.raw = (key: keyof O) => messages[key];

  t.paragraph = function (key: keyof O, ...args: (string | number)[]) {
    const content = t(key, ...args);
    return content
      .trim()
      .split('\n')
      .map(t => t.trim());
  };

  t.regex = function (key: keyof O, ...args: string[]) {
    let content = t(key, ...args);
    content = content.replace(/^\^|\$$/, '');
    for (const arg of args) {
      content = content.replace('(.*)', arg);
    }
    return content;
  };

  return { t, messages };
}
