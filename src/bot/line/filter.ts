import { Constructable } from '@/types';
import { ERROR_CODE_EMPTY } from '@/supabase';
import { getGame } from '@/supabase/game';
import { getPostBackText, isGroupEvent, isPostBackEvent, isSingleEvent, isTextMessage } from './types';
import { WebhookEvent, SKIP, PASS } from './handler';
import { getUser } from './utils/userService';
import { t } from './locales';

interface TextOptions {
  postbackOnly?: boolean;
}

interface TextEqualOptions extends TextOptions {
  /**
   * if true, the text will include the argument
   */
  shouldReturn?: boolean;
}

export function createFilter<R>(callback: (event: WebhookEvent) => R) {
  const handle = (res: R | boolean) => {
    if (res === false) throw SKIP;
    if (res === true) return PASS;
    return res as Exclude<R, boolean>;
  };

  return function (event: WebhookEvent) {
    const promise = callback(event);
    return promise instanceof Promise ? promise.then(handle) : handle(promise);
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
    if (warning) return t('GetUserIdFailed');
  });

export const User = () =>
  createFilter(async event => {
    const userId = event.source.userId;
    const user = await getUser(event, userId);
    return user;
  });

type TER<T = string | undefined | typeof PASS> = (event: WebhookEvent) => T | Promise<T>;
export function TextEqual(except: string | string[]): TER<undefined | typeof PASS>;
export function TextEqual(except: string | string[], options: TextEqualOptions & { shouldReturn: true }): TER<string | undefined | typeof PASS> // prettier-ignore
export function TextEqual(
  except: string | string[],
  { shouldReturn = false, postbackOnly = false }: TextEqualOptions = {}
): TER<string | undefined | typeof PASS> {
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
}

export const TextMatch = (regex: RegExp | string, { postbackOnly = false }: TextOptions = {}) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Game = <G>(GameContructor: Constructable<G> & { create: (payload: any) => G }) => {
  return createFilter(async event => {
    if (!isGroupEvent(event)) return;
    const { data } = await getGame(event.source.groupId);
    if (data && data.type !== GameContructor.name) throw t('OtherGameRuning', data.type);
    return GameContructor.create({ id: data?.groupId });
  });
};

export const CanStartGame = () => {
  return createFilter(async event => {
    if (!isGroupEvent(event)) return;
    const resp = await getGame(event.source.groupId);
    if (resp.data) throw t('OtherGameRuning', resp.data.type);
    return resp.error && resp.error.code !== ERROR_CODE_EMPTY ? null : PASS;
  });
};
