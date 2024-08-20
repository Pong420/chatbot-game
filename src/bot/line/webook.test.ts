import { expect, test } from 'vitest';
import { loadHanlders } from './utils/loadHandlers';
import { createLineEventTestSuite, createMemeberJoinedEvent } from './test';

const handlers = await loadHanlders(import.meta.glob('./handlers/*.ts'));

const { handleEvent } = createLineEventTestSuite(handlers);

test('main', async () => {
  await expect(handleEvent(createMemeberJoinedEvent())).resolves.toBeUndefined();
});
