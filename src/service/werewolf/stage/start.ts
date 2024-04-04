import { plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Character, Villager, Werewolf } from '../character';
import { Stage } from './_stage';
import { Night } from './night';
import type { Init } from './init';

/**
 * For extends configuration from Init
 */
export interface Start extends Init {}

export class Start extends Stage {
  join(player: Pick<Character, 'id' | 'name'>) {
    if (this.players.has(player.id)) {
      throw '已經加入遊戲';
    }

    if (this.players.size === this.numOfPlayers) {
      throw '遊戲已滿';
    }

    this.players.set(player.id, plainToInstance(Character, player));
  }

  next() {
    if (this.players.size < this.numOfPlayers) {
      throw `遊戲人數不足以開始遊戲`;
    }
    return Night;
  }

  onEnd(): void {
    const characters: (typeof Character)[] = [Werewolf];
    while (characters.length < this.numOfPlayers) {
      characters.push(Villager);
    }

    this.players = new Map(
      Array.from(this.players, ([k, v]) => [k, plainToInstance(randomPick(characters), { ...v })])
    );
  }
}
