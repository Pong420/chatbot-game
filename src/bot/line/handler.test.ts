import { expect, test } from 'vitest';
import { createEventHandler, createHandler } from './handler';
import { Single, TextEqual } from './filter';
import { LineUser } from './test';
import { textMessage } from './utils/createMessage';
import { debugHandlers } from './handlers/debug';
import { t } from './locales';

const client = new LineUser();

test('handleEvent', async () => {
  const handleEvent = createEventHandler([createHandler(Single, TextEqual('ping'), () => 'pong')], debugHandlers);

  expect(handleEvent(client.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  expect(handleEvent(client.groupMessage('ping'))).resolves.toBeUndefined();

  expect(handleEvent(client.singleMessage(t('GetGroupID')))).resolves.toBeUndefined();
  expect(handleEvent(client.groupMessage(t('GetGroupID')))).resolves.toEqual(
    textMessage(t('GetGroupIDResp', client.groupId))
  );

  const userIdMsg = textMessage(t('GetUserIDResp', client.userId));
  expect(handleEvent(client.singleMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
  expect(handleEvent(client.groupMessage(t('GetUserID')))).resolves.toEqual(userIdMsg);
});

test('handleEvent - throwError', async () => {
  const handleEvent = createEventHandler([
    createHandler(Single, TextEqual('ping'), () => {
      throw 'pong';
    }),
    createHandler(Single, TextEqual('Error'), () => {
      throw new Error('Test');
    })
  ]);

  await expect(handleEvent(client.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  await expect(handleEvent(client.singleMessage('Error'))).resolves.toBeUndefined();
});
