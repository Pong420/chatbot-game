import { vi } from 'vitest';
import { nanoid } from 'nanoid';
import * as module from './chat';

vi.spyOn(module, 'createChat').mockImplementation(({ game }) => {
  return Promise.resolve({
    data: { id: nanoid(), game, created_at: new Date().toISOString() } as module.Chat,
    error: null
  });
});
