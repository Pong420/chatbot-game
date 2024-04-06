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

  expect(handleEvent(user.singleMessage(t('GetGroupID')))).resolves.toBeUndefined();
  expect(handleEvent(user.groupMessage(t('GetGroupID')))).resolves.toEqual(textMessage(t('GetGroupIDResp', 'group')));

  const userIdMsg = textMessage(t('GetUserIDResp', user.userId));
  expect(handleEvent(user.singleMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
  expect(handleEvent(user.groupMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
});
