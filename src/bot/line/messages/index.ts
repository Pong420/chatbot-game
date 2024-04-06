/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomOption } from '@/utils/random';

type Locale = Awaited<typeof import('./zh-tw')>;

type iMessages = Locale['Messages'];
export type i18nKey = keyof iMessages;

const locale = process.env.LOCALE;

const { Messages }: { Messages: iMessages } = await import(`./${locale}`);

const t = (key: i18nKey, ...args: any[]) => {
  const payload = Messages[key];

  let text = Array.isArray(payload) ? (payload.length === 1 ? payload[0] : randomOption(payload)) : payload;
  args.forEach((a, i) => {
    text = text.replace(`{${i}}`, a);
  });
  return text;
};

export { Messages, t };
