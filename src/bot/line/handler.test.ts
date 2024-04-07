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

  expect(handleEvent(client.singleMessage(t('GroupId')))).resolves.toBeUndefined();
  expect(handleEvent(client.groupMessage(t('GroupId')))).resolves.toEqual(
    textMessage(t('GroupIdResp', client.groupId))
  );

  const userIdMsg = textMessage(t('GetUserIdResp', client.userId));
  expect(handleEvent(client.singleMessage(t('GetUserId')))).resolves.toEqual(userIdMsg);
  expect(handleEvent(client.groupMessage(t('GetUserId')))).resolves.toEqual(userIdMsg);
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
