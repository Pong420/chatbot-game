/* eslint-disable @typescript-eslint/no-explicit-any */
type iMessages = (typeof import('./zh-tw'))['Messages'];

const locale = process.env.LOCALE;

const { Messages }: { Messages: iMessages } = await import(`./${locale}`);

export { Messages };
