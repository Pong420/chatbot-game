import { vi } from 'vitest';
import * as module from './achievement';

vi.spyOn(module, 'updateAchivement').mockImplementation(() => {
  return Promise.resolve();
});
