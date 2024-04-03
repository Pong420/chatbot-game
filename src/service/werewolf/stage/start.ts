import { plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Character, Villager, Werewolf } from '../character';
import { Stage } from './_stage';
import { Night } from './night';

export class Start extends Stage {
  onStart(): void {
    const characters: (typeof Character)[] = [Werewolf];
    while (characters.length < this.numOfPlayers) {
      characters.push(Villager);
    }

    this.players = new Map(
      Array.from(this.players, ([k, v]) => [k, plainToInstance(randomPick(characters), { ...v })])
    );
  }

  next() {
    return Night;
  }
}
