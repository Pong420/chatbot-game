import { plainToInstance } from 'class-transformer';
import { randomPick } from '@/utils/random';
import { Character, Villager, Werewolf } from '../character';
import { Stage } from './_stage';
import { Night } from './night';
import type { Init } from './init';
import { errors } from '../error';

/**
 * For extends configuration from Init
 */
export interface Start extends Init {}

export class Start extends Stage {
  join(player: Pick<Character, 'id' | 'name'>) {
    if (this.players.has(player.id)) {
      throw errors('DUPLICATED_JOIN');
    }

    if (this.players.size === this.numOfPlayers) {
      throw errors('GAME_FULL');
    }

    this.players.set(player.id, plainToInstance(Character, player));
  }

  next() {
    if (this.players.size < this.numOfPlayers) {
      throw errors('NOT_ENOUGH_PLAYERS');
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
