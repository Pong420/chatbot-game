import { nanoid } from 'nanoid';
import { expect, test } from 'vitest';
import { createEventHandler } from '@line/handler';
import { LineUser } from '@line/test';
import { textMessage } from '@line/utils/createMessage';
import { maxLength } from '@line/utils/user';
import { t } from '@line/locales';
import { nicknameHandlers, crearteIntroContent } from './nickname';

const client = new LineUser();
const handleEvent = createEventHandler(nicknameHandlers);

test('nickname', async () => {
  await expect(handleEvent(client.singleMessage(t(`NickNameIntro`)))).resolves.toEqual(crearteIntroContent());
  await expect(handleEvent(client.singleMessage(t(`MyNickName`)))).resolves.toEqual(textMessage(client.name));

  const nickname = `New Name`;
  const setNicknameMsg = (nickname: string) =>
    client.singleMessage(t(`SetNickName`).replace('^', '').replace('(.*)', nickname));
  await expect(handleEvent(setNicknameMsg(nickname))).resolves.toEqual(textMessage(t('NickNameSuccess')));

  await expect(handleEvent(client.singleMessage(t(`MyNickName`)))).resolves.toEqual(textMessage(nickname));

  await expect(handleEvent(setNicknameMsg(nickname))).resolves.toEqual(textMessage(t('NickNameUsing', nickname)));

  expect(handleEvent(setNicknameMsg(''))).resolves.toEqual(textMessage(t('NickNameEmpty')));
  expect(handleEvent(setNicknameMsg(nanoid()))).resolves.toEqual(textMessage(t('NickNameMaxLength', maxLength)));
  expect(handleEvent(setNicknameMsg('「${nickname}」'))).resolves.toEqual(textMessage(t('NickNameContainBracket')));
});

test('nickname intro content', async () => {
  const content = JSON.stringify(crearteIntroContent()['contents']);
  expect(content).toContain(t('MyNickName'));
  expect(content).toContain(maxLength);
});
