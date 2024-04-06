import { getPostBackText, isGroupEvent, isPostBackEvent, isSingleEvent, isTextMessage } from './types';
import { LineBotErrorMessage } from './error';
import { WebhookEvent, SKIP } from './handler';

export function createFilter<R>(callback: (event: WebhookEvent) => R | boolean) {
  return function (event: WebhookEvent) {
    const res = callback(event);
    if (res === false) throw SKIP;
    if (res === true) return SKIP;
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
    if (warning) throw new LineBotErrorMessage('CANNOT_GetUserID');
  });

export const TextEqual = (options: string | string[], { shouldReturn = true, postbackOnly = false } = {}) => {
  const validate =
    typeof options === 'string'
      ? (payload: string) => options === payload
      : (payload: string) => options.includes(payload);

  return createFilter(event => {
    let text = '';

    if (isPostBackEvent(event)) {
      text = getPostBackText(event);
    } else if (postbackOnly) return;

    if (isTextMessage(event)) {
      text = event.message.text;
    }

    if (!!text && shouldReturn && validate(text)) return text;
  });
};

export const TextMatch = (regex: RegExp, { postbackOnly = false } = {}) => {
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
