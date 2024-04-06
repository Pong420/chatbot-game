import { getUser } from '@/service/users';
import { getPostBackText, isGroupEvent, isPostBackEvent, isSingleEvent, isTextMessage } from './types';
import { LineBotErrorMessage } from './error';
import { WebhookEvent, SKIP, PASS } from './handler';

interface TextOptions {
  postbackOnly?: boolean;
}

interface TextEqualOptions extends TextOptions {
  /**
   * if true, the text will include the argument
   */
  shouldReturn?: boolean;
}

// prettier-ignore
interface TextEqual {
  (except: string | string[]): (event: WebhookEvent) => undefined | typeof PASS;
  (except: string | string[], options: TextEqualOptions & { shouldReturn: true }): (event: WebhookEvent) => string | undefined | typeof PASS;
  (except: string | string[], options?: TextEqualOptions): (event: WebhookEvent) => string | undefined | typeof PASS | typeof SKIP;
}

export function createFilter<R>(callback: (event: WebhookEvent) => R | boolean) {
  return function (event: WebhookEvent) {
    const res = callback(event);
    if (res === false) throw SKIP;
    if (res === true) return PASS;
    return res as Exclude<R, boolean>;
  };
}

export const Group = createFilter(event => (isGroupEvent(event) ? event : false));
export const MemberJoin = createFilter(event => event.type === 'memberJoined');
export const MemberLeft = createFilter(event => event.type === 'memberLeft');
export const LeaveGroup = createFilter(event => event.type === 'leave');

export const Single = createFilter(isSingleEvent);

export const UserId = ({ warning = true } = {}) =>
  createFilter(event => {
    const userId = event.source.userId;
    if (userId) return userId;
    if (warning) throw new LineBotErrorMessage('CANNOT_GET_UER_ID');
  });

export const User = ({ warning = true } = {}) =>
  createFilter(async event => {
    const userId = event.source.userId;
    if (userId) {
      const { data, error } = await getUser(userId);
      if (error) throw new LineBotErrorMessage('SYSTEM_ERROR');
      return data;
    }
    if (warning) throw new LineBotErrorMessage('CANNOT_GET_UER_ID');
  });

export const TextEqual = ((
  except: string | string[],
  { shouldReturn = false, postbackOnly = false }: TextEqualOptions
) => {
  const validate =
    typeof except === 'string'
      ? (payload: string) => except === payload
      : (payload: string) => except.includes(payload);

  return createFilter(event => {
    let text = '';

    if (isPostBackEvent(event)) {
      text = getPostBackText(event);
    } else if (postbackOnly) return;

    if (isTextMessage(event)) {
      text = event.message.text;
    }

    if (!!text && validate(text)) {
      return shouldReturn ? text : PASS;
    }
  });
}) as TextEqual;

export const TextMatch = (regex: RegExp, { postbackOnly = false }: TextOptions = {}) => {
  return createFilter(event => {
    let text = '';

    if (isPostBackEvent(event)) {
      text = getPostBackText(event);
    } else if (postbackOnly) return;

    if (isTextMessage(event)) {
      text = event.message.text;
    }

    return !!text && text.match(regex);
  });
};
