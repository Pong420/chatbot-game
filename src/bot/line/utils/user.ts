import { WebhookEvent } from '@line/bot-sdk';
import * as api from '@/service/user';
import { getUserProfile } from './getUserProfile';
import { textMessage } from './createMessage';
import { t } from '../messages';

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
    return textMessage(t('NickNameMaxLength', maxLength));
  }

  if (name.length === 0) {
    return textMessage(t('NickNameEmpty'));
  }

  if (/「.*」/.test(name)) {
    return textMessage(t(`NickNameContainBracket`));
  }

  const user = await getUser(event);
  if (name === user.nickname) throw t(`NickNameUsing`, name);
  try {
    await api.updateUser(user.userId, { nickname: name });
    return t(`NickNameSuccess`);
  } catch (error) {
    throw t('NickNameFailed');
  }
}
