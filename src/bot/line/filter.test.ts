import { expect, test } from 'vitest';
import { createHandler, WebhookEvent } from './handler';
import { Group, Single, TextEqual, TextMatch, UserId } from './filter';
import { User } from './test/mockUser';

const user = new User(`${Math.random()}`, 'group');
const singleMessage = user.singleMessage('Hello');
const groupMessage = user.groupMessage('Hello');

test('Single & Group', () => {
  const callback = (event: WebhookEvent) => {
    expect(event).toMatchObject({ type: 'message' });
    return `World`;
  };
  const singleHandler = createHandler(Single, callback);
  const gorupHandler = createHandler(Group, callback);

  expect(singleHandler(singleMessage)).resolves.toEqual('World');
  expect(singleHandler(groupMessage)).resolves.toBeUndefined();
  expect(gorupHandler(singleMessage)).resolves.toBeUndefined();
  expect(gorupHandler(groupMessage)).resolves.toEqual('World');
});

test('UserId', () => {
  const singleHandler = createHandler(Single, UserId(), userId => userId);
  const gorupHandler = createHandler(Group, UserId(), (_event, userId) => userId);

  expect(singleHandler(singleMessage)).resolves.toEqual(user.userId);
  expect(gorupHandler(groupMessage)).resolves.toEqual(user.userId);
});

test('TextEqual', () => {
  const singleHandler = createHandler(Single, TextEqual('Hello'), () => 'World');
  expect(singleHandler(user.singleMessage('Hello'))).resolves.toEqual('World');
  expect(singleHandler(user.singleMessage(`${Math.random()}`))).resolves.toBeUndefined();
});

test('TextMatch', () => {
  const singleHandler = createHandler(Single, TextMatch(/Hello (.*)/), matches => matches[1]);
  expect(singleHandler(user.singleMessage('Hello World'))).resolves.toEqual('World');
});
