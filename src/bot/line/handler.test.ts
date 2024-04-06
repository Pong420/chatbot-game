import { expect, test, vi } from 'vitest';
import { createEventHandler, createHandler } from './handler';
import { Single, TextEqual } from './filter';
import { User } from './test/mockUser';
import { textMessage } from './utils/createMessage';
import { client } from './client';
import { t } from './messages';
import debugHandlers from './service/debug';

const user = new User(`${Math.random()}`, 'group');

const handlers = [createHandler(Single, TextEqual('ping'), () => 'pong'), ...debugHandlers];

const handleEvent = createEventHandler(handlers);

client.replyMessage = vi.fn().mockImplementation(async function ({
  messages
}: Parameters<(typeof client)['replyMessage']>[0]) {
  return messages[0];
});

test('handleEvent', async () => {
  expect(handleEvent(user.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  expect(handleEvent(user.groupMessage('ping'))).resolves.toBeUndefined();

  expect(handleEvent(user.singleMessage(t('GET_GROUP_ID')))).resolves.toBeUndefined();
  expect(handleEvent(user.groupMessage(t('GET_GROUP_ID')))).resolves.toEqual(
    textMessage(t('GET_GROUP_ID_RESP', 'group'))
  );

  const userIdMsg = textMessage(t('GET_USER_ID_RESP', user.userId));
  expect(handleEvent(user.singleMessage(t('GET_USER_ID')))).resolves.toEqual(userIdMsg);
  expect(handleEvent(user.groupMessage(t('GET_USER_ID')))).resolves.toEqual(userIdMsg);
});
