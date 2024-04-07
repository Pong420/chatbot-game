/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebhookEvent } from '@line/bot-sdk';
import { expect, test } from 'vitest';
import { createHandler } from './handler';
import { createFilter, Group, Single, TextEqual, TextMatch, UserId } from './filter';
import { LineUser } from './test';

const client = new LineUser();
const singleMessage = client.singleMessage('Hello');
const groupMessage = client.groupMessage('Hello');

test('rule', async () => {
  const Zero = () => 0;
  const EmptyString = () => '';
  const Truthy = () => true;
  const Falsy = () => false;
  const Undefined = () => undefined;
  const Null = () => null;

  const run = (...filters: any[]) => createFilter(...filters, (...args) => args.length)(singleMessage);

  await expect(run(Zero)).resolves.toEqual(2);
  await expect(run(EmptyString)).resolves.toEqual(2);

  await expect(run(Truthy)).resolves.toEqual(1);
  await expect(run(Undefined)).resolves.toEqual(1);
  await expect(run(Null)).resolves.toEqual(1);

  await expect(run(Falsy)).resolves.toBeUndefined();
});

test('Single & Group', async () => {
  const callback = (event: WebhookEvent) => {
    expect(event).toMatchObject({ type: 'message' });
    return `World`;
  };
  const singleHandler = createHandler(Single, callback);
  const groupHandler = createHandler(Group, callback);

  await expect(singleHandler(singleMessage)).resolves.toEqual('World');
  await expect(singleHandler(groupMessage)).resolves.toBeUndefined();
  await expect(groupHandler(singleMessage)).resolves.toBeUndefined();
  await expect(groupHandler(groupMessage)).resolves.toEqual('World');
});

test('UserId', async () => {
  const singleHandler = createHandler(Single, UserId(), userId => userId);
  const groupHandler = createHandler(Group, UserId(), (_event, userId) => userId);
  await expect(singleHandler(singleMessage)).resolves.toEqual(client.userId);
  await expect(groupHandler(groupMessage)).resolves.toEqual(client.userId);
});

test('TextEqual', async () => {
  const singleHandler = createHandler(Single, TextEqual('Hello'), () => 'World');
  const singleHandler2 = createHandler(Single, TextEqual('Hello', { shouldReturn: true }), text => text);
  await expect(singleHandler(client.singleMessage('Hello'))).resolves.toEqual('World');
  await expect(singleHandler(client.singleMessage(`${Math.random()}`))).resolves.toBeUndefined();
  await expect(singleHandler2(client.singleMessage('Hello'))).resolves.toEqual('Hello');
});

test('TextMatch', async () => {
  const singleHandler = createHandler(Single, TextMatch(/Hello (.*)/), matches => matches[1]);
  await expect(singleHandler(client.singleMessage('Hello World'))).resolves.toEqual('World');
});
