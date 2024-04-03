import { plainToInstance } from 'class-transformer';
import { Stage } from './_stage';
import { Start } from './start';
import { Character } from '../character';

export class Pending extends Stage {
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
    return this.transition(() => Start);
  }
}
