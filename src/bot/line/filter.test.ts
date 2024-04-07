import { expect, test } from 'vitest';
import { createHandler, WebhookEvent } from './handler';
import { Group, Single, TextEqual, TextMatch, UserId } from './filter';
import { LineUser } from './test';

const client = new LineUser();
const singleMessage = client.singleMessage('Hello');
const groupMessage = client.groupMessage('Hello');

test('Single & Group', () => {
  const callback = (event: WebhookEvent) => {
    expect(event).toMatchObject({ type: 'message' });
    return `World`;
  };
  const singleHandler = createHandler(Single, callback);
  const groupHandler = createHandler(Group, callback);

  expect(singleHandler(singleMessage)).resolves.toEqual('World');
  expect(singleHandler(groupMessage)).resolves.toBeUndefined();
  expect(groupHandler(singleMessage)).resolves.toBeUndefined();
  expect(groupHandler(groupMessage)).resolves.toEqual('World');
});

test('UserId', () => {
  const singleHandler = createHandler(Single, UserId(), userId => userId);
  const groupHandler = createHandler(Group, UserId(), (_event, userId) => userId);

  expect(singleHandler(singleMessage)).resolves.toEqual(client.userId);
  expect(groupHandler(groupMessage)).resolves.toEqual(client.userId);
});

test('TextEqual', () => {
  const singleHandler = createHandler(Single, TextEqual('Hello'), () => 'World');
  const singleHandler2 = createHandler(Single, TextEqual('Hello', { shouldReturn: true }), text => text);
  expect(singleHandler(client.singleMessage('Hello'))).resolves.toEqual('World');
  expect(singleHandler(client.singleMessage(`${Math.random()}`))).resolves.toBeUndefined();
  expect(singleHandler2(client.singleMessage('Hello'))).resolves.toEqual('Hello');
});

test('TextMatch', () => {
  const singleHandler = createHandler(Single, TextMatch(/Hello (.*)/), matches => matches[1]);
  expect(singleHandler(client.singleMessage('Hello World'))).resolves.toEqual('World');
});
