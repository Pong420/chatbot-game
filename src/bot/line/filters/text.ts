import { WebhookEvent } from '@line/bot-sdk';
import { getPostBackText, isPostBackEvent, isTextMessage } from '@line/types';

interface TextOptions {
  postbackOnly?: boolean;
}

interface TextEqualOptions extends TextOptions {
  /**
   * if true, the text will include the argument
   */
  shouldReturn?: boolean;
}

type TextEqualReturn<T = string | boolean | undefined> = (event: WebhookEvent) => T | Promise<T>;
export function TextEqual(except: string | string[]): TextEqualReturn<false | undefined>;
export function TextEqual(except: string | string[], options?: TextEqualOptions): TextEqualReturn; // prettier-ignore
export function TextEqual(except: string | string[], options: TextEqualOptions & { shouldReturn: true }): TextEqualReturn; // prettier-ignore
export function TextEqual(except: string | string[], options: TextEqualOptions = {}): TextEqualReturn {
  const validate =
    typeof except === 'string'
      ? (payload: string) => except === payload
      : (payload: string) => except.includes(payload);

  return (event: WebhookEvent) => {
    let text = '';

    if (isPostBackEvent(event)) {
      text = getPostBackText(event);
    } else if (options?.postbackOnly) return false;

    if (isTextMessage(event)) {
      text = event.message.text;
    }

    if (!!text && validate(text)) {
      return !options?.shouldReturn || text;
    }

    return false;
  };
}

export const TextMatch = (regex: RegExp | string, { postbackOnly = false }: TextOptions = {}) => {
  return (event: WebhookEvent) => {
    let text = '';

    if (isPostBackEvent(event)) {
      text = getPostBackText(event);
    } else if (postbackOnly) return;

    if (isTextMessage(event)) {
      text = event.message.text;
    }

    return (!!text && text.match(regex)) || false;
  };
};
