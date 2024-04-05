import { Character } from './_character';
import { Action } from '../decorators';
import { errors } from '../error';
import { Killed } from '../death';
import { Night } from '../stage';

export class Werewolf extends Character {
  hungry = false;

  killed: string[] = [];

  @Action(() => Night)
  kill(character: Character) {
    if (character.isDead) throw errors('TARGET_IS_DEAD');
    const suicide = this.id === character.id;
    character.dead(Killed, { userId: this.id });
    this.killed.push(character.id);
    this.hungry = !suicide;
    return { suicide };
  }

  @Action(() => Night)
  idle() {
    if (this.hungry) throw errors('HUNGRY');
    this.hungry = true;
  }

  @Action(() => Night)
  suicide() {
    return this.kill(this);
  }
}
