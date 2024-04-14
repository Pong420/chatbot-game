import { expect, test } from 'vitest';
// import { Character } from './_character';
import * as characters from './_characters';

test('character properties', () => {
  for (const key in characters) {
    const Constructor = characters[key as keyof typeof characters];
    const character = new Constructor();
    expect(character).toHaveProperty('type', expect.any(String));
    expect(character).toHaveProperty('name', expect.any(String));
    expect(character).toHaveProperty('good', expect.any(Boolean));
  }
});
