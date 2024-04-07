import { WebhookEvent } from '@line/bot-sdk';
import { t } from '@line/messages';
import * as api from '@/service/user';
import { ERROR_CODE_EMPTY } from '@/utils/supabase';
import { getUserProfile } from './getUserProfile';

export const maxLength = 15;

export async function getUser(event: WebhookEvent | null, userId = event?.source.userId || '') {
  if (!userId) throw t('SystemError');

  let resp = await api.getUser(userId);
  if (!resp.data && resp.error.code === ERROR_CODE_EMPTY) {
    const profile = await getUserProfile(event, userId);
    if (profile) {
      resp = await api.createUser(userId, profile.displayName);
    }
  }
  if (resp.error) throw t('SystemError');
  return resp.data;
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
