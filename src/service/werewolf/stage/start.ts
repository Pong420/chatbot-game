import { plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Constructable } from '@/types';
import { Character, Villager, Werewolf } from '../character';
import { Stage } from './_stage';
import { Night } from './night';

export class Start extends Stage {
  next() {
    const werewolfs = [Werewolf];
    const characters: Constructable<typeof Character>[] = [
      ...werewolfs,
      ...Array.from({ length: this.players.size - werewolfs.length }, () => Villager)
    ];

    this.players = new Map(
      Array.from(this.players, ([k, v]) => {
        const Character = randomPick(characters);
        return [k, plainToInstance(Character, { ...v }) as Character];
      })
    );

    return this.transition(() => Night);
  }
}
