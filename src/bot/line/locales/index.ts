/* eslint-disable @typescript-eslint/no-explicit-any */
import { locale, createTranslateFunction } from '@/utils/locale';

export type LineBotMessages = (typeof import('./zh-tw'))['default'];
export type LineBotMessageKey = keyof LineBotMessages;

const { messages, t } = createTranslateFunction<LineBotMessages>(await import(`./${locale}`));

export { messages, t };
