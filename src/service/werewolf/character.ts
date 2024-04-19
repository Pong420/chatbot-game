import { Character } from './character/_character';
import * as characters from './character/_characters';

export const characterMap: Record<string, typeof Character> = {};
export const characterNameMap = new Map<typeof Character, string>();

for (const k in characters) {
  const constructor = characters[k as keyof typeof characters];
  if (Object.prototype.isPrototypeOf.call(Character, constructor)) {
    characterMap[k] = constructor;
    characterNameMap.set(constructor, k);
  }
}

export * from './character/_character';
export * from './character/_characters';
export * as characters from './character/_characters';
