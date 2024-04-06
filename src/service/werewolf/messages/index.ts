/* eslint-disable @typescript-eslint/no-explicit-any */
import { locale, createTranslateFunction } from '@/utils/locale';

export type WerewolfMessages = (typeof import('./zh-tw'))['default'];
export type WerewolfMessageKey = keyof WerewolfMessages;

const { messages, t } = createTranslateFunction<WerewolfMessages>(await import(`./${locale}`));

export { messages, t };
