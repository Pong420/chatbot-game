/* eslint-disable @typescript-eslint/no-explicit-any */
type iMessages = (typeof import('./zh-tw'))['Messages'];
export type i18nKey = keyof iMessages;

const locale = 'zh-tw';

const { Messages }: { Messages: iMessages } = await import(`./${locale}`);

const t = (key: i18nKey, ...args: any[]) => {
  let text = Messages[key];
  args.forEach((a, i) => {
    text = text.replace(`{${i}}`, a);
  });
  return text;
};

Object.assign(global, { t });

export { Messages, t };
