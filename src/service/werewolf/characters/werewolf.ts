import { Character, CauseOfDeath } from './character';

export class WereWolf extends Character {
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
