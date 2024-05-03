import { nanoid } from 'nanoid';
import { test } from 'vitest';
import { createLineEventTestSuite } from '@line/test';
import { textMessage } from '@line/utils/createMessage';
import { maxLength } from '@line/utils/userService';
import { t } from '@line/locales';
import { nicknameHandlers } from './nickname';

const { createLineUser } = createLineEventTestSuite(nicknameHandlers);
const client = createLineUser();

test('nickname', async () => {
  await client.s(t(`MyNickName`)).toEqual(textMessage(client.name));

  const nickname = `New Name`;
  const setNickName = (nickname: string) => client.s(t.regex('SetNickName', nickname));

  await setNickName(nickname).toTextMessage(t('NickNameSuccess', nickname));
  await setNickName(nickname).toTextMessage(t('NickNameUsing', nickname));
  await setNickName('').toTextMessage(t('NickNameEmpty'));
  await setNickName(nanoid()).toTextMessage(t('NickNameMaxLength', maxLength));
  await setNickName('「${nickname}」').toTextMessage(t('NickNameContainBracket'));

  await client.s(t(`MyNickName`)).toTextMessage(nickname);
});
