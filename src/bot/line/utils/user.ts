import { WebhookEvent } from '@line/bot-sdk';
import { getUserProfile } from './getUserProfile';
import { t } from '../messages';
import * as api from '@/service/user';

export const maxLength = 15;

export async function getUser(event: WebhookEvent | null, userId = event?.source.userId || '') {
  if (!userId) throw t('SystemError');

  let user = await api.getUser(userId);
  if (!user.error && !user.data) {
    const profile = await getUserProfile(event, userId);
    if (profile) {
      user = await api.createUser(userId, profile.displayName);
    }
  }
  if (user.error) throw t('SystemError');

  return user.data;
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
