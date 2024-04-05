import { expect, test, vi } from 'vitest';
import { createEventHandler, createHandler } from './handler';
import { Group, Single, TextEqual, UserId } from './filter';
import { User } from './test/mockUser';
import { textMessage } from './utils/createMessage';
import { client } from './client';

const user = new User(`${Math.random()}`, 'group');

const handlers = [
  createHandler(Single, TextEqual('ping'), () => 'pong'),
  createHandler(Group, TextEqual('What is the group id'), event => `The group id is ${event.source.groupId}`),
  createHandler(UserId(), TextEqual('What is my user id'), userId => `You user id is ${userId}`)
];

const handleEvent = createEventHandler(handlers);

client.replyMessage = vi.fn().mockImplementation(async function ({
  messages
}: Parameters<(typeof client)['replyMessage']>[0]) {
  return messages[0];
});

test('handleEvent', async () => {
  expect(handleEvent(user.singleMessage('ping'))).resolves.toMatchObject(textMessage('pong'));
  expect(handleEvent(user.groupMessage('ping'))).resolves.toBeUndefined();

  expect(handleEvent(user.singleMessage('What is the group id'))).resolves.toBeUndefined();
  expect(handleEvent(user.groupMessage('What is the group id'))).resolves.toEqual(textMessage(`The group id is group`));

  const userIdMsg = textMessage(`You user id is ${user.userId}`);
  expect(handleEvent(user.singleMessage('What is my user id'))).resolves.toEqual(userIdMsg);
  expect(handleEvent(user.groupMessage('What is my user id'))).resolves.toEqual(userIdMsg);
});
