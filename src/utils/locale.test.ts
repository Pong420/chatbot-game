import { expect, test } from 'vitest';
import { createTranslateFunction } from './locale';

test('replace', () => {
  const { t } = createTranslateFunction({
    default: {
      replaceAll: `{0}, {0}, {1}, {2}`
    }
  });
  expect(t('replaceAll', 'a', 'b', 'c')).toEqual(`a, a, b, c`);
});
