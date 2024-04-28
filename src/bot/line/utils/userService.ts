import { WebhookEvent } from '@line/bot-sdk';
import { t } from '@line/locales';
import * as api from '@service/game/user';
import { getUserProfile } from './getUserProfile';

export const maxLength = 15;

export async function getUser(event: WebhookEvent | null, userId = event?.source.userId || '') {
  if (!userId) throw t(`GetUserIdFailed`);

  try {
    let user = await api.getUser(userId);
    if (!user) {
      const profile = await getUserProfile(event, userId);
      if (!profile) throw `profile not found`;
      user = await api.createUser({ userId, nickname: profile.displayName });
    }
    if (!user) throw `cannot get user from database`;
    return user;
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
    await api.updateUser(user.userId, { nickname: name });
    return t(`NickNameSuccess`);
  } catch (error) {
    return t('NickNameFailed');
  }
}
