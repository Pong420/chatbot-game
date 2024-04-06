/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
type iMessages = typeof import('./zh-tw');
export type i18nKey = keyof iMessages['default'];

const locale = 'zh-tw';

const { default: Messages } = (await import(`./${locale}`)) as iMessages;
const t = (key: i18nKey, ...args: any[]) => {
  let text = Messages[key];
  args.forEach((a, i) => {
    text = text.replace(`{${i}}`, a);
  });
  return text;
};

Object.assign(global, { t });

export { Messages, t };
