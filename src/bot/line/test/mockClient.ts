import { vi } from 'vitest';
import { client } from '@line/client';

vi.spyOn(client, 'replyMessage').mockImplementation(({ messages }: Parameters<(typeof client)['replyMessage']>[0]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Promise.resolve(messages.length > 1 ? messages : messages[0]) as any;
});

export { client };
