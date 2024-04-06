import { expect, test } from 'vitest';
import { nanoid } from 'nanoid';
import { createEventHandler, createHandler } from './handler';
import { Single, TextEqual } from './filter';
import { LineUser } from './test/mockLineUser';
import { textMessage } from './utils/createMessage';
import { debugHandlers } from './service/debug';
import { t } from './messages';

const userId = nanoid();
const groupdId = nanoid();
const client = new LineUser(userId, groupdId);

const handlers = [createHandler(Single, TextEqual('ping'), () => 'pong'), ...debugHandlers];

const handleEvent = createEventHandler(handlers);

test('handleEvent', async () => {
  expect(handleEvent(client.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  expect(handleEvent(client.groupMessage('ping'))).resolves.toBeUndefined();

  expect(handleEvent(client.singleMessage(t('GetGroupID')))).resolves.toBeUndefined();
  expect(handleEvent(client.groupMessage(t('GetGroupID')))).resolves.toEqual(
    textMessage(t('GetGroupIDResp', groupdId))
  );

  const userIdMsg = textMessage(t('GetUserIDResp', client.userId));
  expect(handleEvent(client.singleMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
  expect(handleEvent(client.groupMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
});
