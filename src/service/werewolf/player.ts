import { Type, DiscriminatorDescriptor } from 'class-transformer';
import { Constructable } from '@/types';
import * as characters from './characters';

const { Character, ...classes } = characters;
type Character = characters.Character;

const subTypes: DiscriminatorDescriptor['subTypes'] = [];
const characterMap: Record<string, Constructable<typeof Character>> = {};

for (const k in classes) {
  const value = classes[k as keyof typeof classes];
  if (Object.prototype.isPrototypeOf.call(Character, value)) {
    subTypes.push({ name: value.name, value });
    characterMap[value.name] = value as Constructable<typeof Character>;
  }
}

export class Player {
  id: string;
  name: string;

  @Type(() => Character, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'name',
      subTypes
    }
  })
  character?: Character;
}
