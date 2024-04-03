import { Character } from './_character';
import { CauseOfDeath } from '../cause-of-death';

export class Werewolf extends Character {
  character = 'werewolf';

  killed: Character[] = [];

  hungry = false;

  get suicide() {
    return this.isKilledBy(this);
  }

  kill(character: Character) {
    character.dead(this);
    this.killed.push(character);
  }

  killBy(causeOfDeath: CauseOfDeath) {
    super.dead(causeOfDeath);
  }
}
