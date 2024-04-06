import { beforeAll, expect, test } from 'vitest';
import { createEventHandler } from '../handler';
import { LineUser } from '../test/mockLineUser';
import { createUser } from '../test/mockDatabase';
import { textMessage } from '../utils/createMessage';
import { t } from '../messages';
import { nicknameHandlers, crearteIntroContent } from './nickname';

const client = new LineUser();
const handleEvent = createEventHandler(nicknameHandlers);

beforeAll(() => {
  createUser(client);
});

test('nickname', async () => {
  expect(handleEvent(client.singleMessage(t(`NickNameIntro`)))).resolves.toEqual(crearteIntroContent());
  expect(handleEvent(client.singleMessage(t(`MyNickName`)))).resolves.toEqual(textMessage(client.name));

  // const newName = 'New Name';
  // expect(handleEvent(client.singleMessage(t(`SetNickName`) + ' ' + newName))).resolves.toEqual(
  //   textMessage(t('NickNameSuccess'))
  // );
});
