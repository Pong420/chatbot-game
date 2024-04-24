import { WebhookEvent } from '@line/bot-sdk';
import { t } from '@line/locales';
import { ERROR_CODE_EMPTY } from '@/supabase';
import * as api from '@/supabase/user';
import { getUserProfile } from './getUserProfile';

export const maxLength = 15;

export async function getUser(event: WebhookEvent | null, userId = event?.source.userId || '') {
  if (!userId) throw t(`GetUserIdFailed`);

  try {
    const resp = await api.getUser(userId).catch(async error => {
      if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EMPTY) {
        const profile = await getUserProfile(event, userId);
        if (!profile) throw `profile not found`;
        return api.createUser({ userId, nickname: profile.displayName });
      }
      throw error;
    });
    if (!resp.data) throw `cannot get user from database`;
    return resp.data;
  } catch (error) {
    console.error(error);
    throw t('SystemError');
  }
}

export async function setNickname(event: WebhookEvent, name: string) {
  name = name.trim();

  if (name.length > maxLength) {
    return t('NickNameMaxLength', maxLength);
  }

  if (name.length === 0) {
    return t('NickNameEmpty');
  }

  if (/「.*」/.test(name)) {
    return t(`NickNameContainBracket`);
  }

  const user = await getUser(event);

  if (name === user.nickname) return t(`NickNameUsing`, name);

  try {
    const { error } = await api.updateUser(user.userId, { nickname: name });
    if (error) throw error;
    return t(`NickNameSuccess`);
  } catch (error) {
    return t('NickNameFailed');
  }
}
