/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'vitest';
import { WebhookEvent } from '@line/bot-sdk';
import { createEventHandler, Handler } from '@line/handler';
import { AnyFunction } from '@/types';
import { LineUser } from './mockLineUser';
import './mockClient';

type CreateMessage = string | ((...args: any[]) => string);
type OmitLineUserArg<F> = F extends (x: LineUser, ...args: infer P) => any ? P : [];
type BuilderUtils = {
  g: ReturnType<typeof createBuilderUtil>;
  s: ReturnType<typeof createBuilderUtil>;
};

export function createExpectEvent(handlers: Handler[]) {
  const handleEvent = createEventHandler(handlers);
  return (event: WebhookEvent) => expect(handleEvent(event)).resolves;
}

const createBuilderUtil = (type: 'group' | 'single') => {
  return <C extends CreateMessage>(create: C) =>
    (client: LineUser, ...args: C extends AnyFunction ? Parameters<C> : []): WebhookEvent => {
      const message = typeof create === 'function' ? create(...args) : (create as string);
      return type === 'group' ? client.groupMessage(message) : client.singleMessage(message);
    };
};

export function createLineEventTestSuite<
  Messages extends Record<string, (client: LineUser, ...args: any[]) => WebhookEvent>
>(handlers: Handler[], builder: (options: BuilderUtils) => Messages) {
  const expectEvent = createExpectEvent(handlers);
  const messages = builder({ g: createBuilderUtil('group'), s: createBuilderUtil('single') });

  const createLineUser = (payload: LineUser | ConstructorParameters<typeof LineUser>[0]) => {
    const client = payload instanceof LineUser ? payload : new LineUser(payload);
    const api = {} as {
      [K in keyof Messages]: (...args: OmitLineUserArg<Messages[K]>) => ReturnType<typeof expectEvent>;
    };
    const general = {
      g: (...params: Parameters<LineUser['groupMessage']>) => expectEvent(client.groupMessage(...params)),
      s: (...params: Parameters<LineUser['singleMessage']>) => expectEvent(client.singleMessage(...params))
    };

    for (const k in messages) {
      api[k] = (...args) => expectEvent(messages[k](client, ...args));
    }
    return Object.assign(client, api, general) as LineUser & typeof api & typeof general;
  };

  return { createLineUser };
}
