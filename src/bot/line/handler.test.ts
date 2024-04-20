import { expect, test, vi } from 'vitest';
import { Single, TextEqual } from './filter';
import { createEventHandler, createHandler } from './handler';
import { debugHandlers } from './handlers/debug';
import { textMessage } from './utils/createMessage';
import { LineUser } from './test';
import { t } from './locales';

const client = new LineUser();

test('handleEvent', async () => {
  const handleEvent = createEventHandler([createHandler(TextEqual('ping'), () => 'pong')], debugHandlers);

  await expect(handleEvent(client.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  await expect(handleEvent(client.groupMessage('ping'))).resolves.toMatchObject(textMessage('pong'));

  await expect(handleEvent(client.singleMessage(t('GroupId')))).resolves.toBeUndefined();
  await expect(handleEvent(client.groupMessage(t('GroupId')))).resolves.toEqual(
    textMessage(t('GroupIdResp', client.groupId))
  );

  const userIdMsg = textMessage(t('GetUserIdResp', client.userId));
  await expect(handleEvent(client.singleMessage(t('GetUserId')))).resolves.toEqual(userIdMsg);
  await expect(handleEvent(client.groupMessage(t('GetUserId')))).resolves.toEqual(userIdMsg);
});

test('handleEvent - undefined', async () => {
  const callback = vi.fn();
  const handleEvent = createEventHandler([createHandler(() => undefined, callback)], debugHandlers);
  await expect(handleEvent(client.singleMessage(t('GetUserId')))).resolves.toTextMessage(expect.any(String));

  /**
   * Return false is don't wants callback to be called
   */
  expect(callback).toBeCalledTimes(1);
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

  await expect(handleEvent(client.singleMessage('ping'))).resolves.toEqual(textMessage('pong'));
  await expect(handleEvent(client.singleMessage('Error'))).resolves.toEqual(textMessage('Test'));
});
