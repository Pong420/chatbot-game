import { Character } from './_character';
import { Action } from '../decorators';
import { errors } from '../error';
import { KillBy } from '../death';

export class Werewolf extends Character {
  hungry = false;

  killed: string[] = [];

  @Action()
  kill(character: Character) {
    character.dead(KillBy, { userId: this.id });
    this.killed.push(character.id);
    this.hungry = false;
  }

  @Action()
  idle() {
    if (this.hungry) throw errors('HUNGRY');
    this.hungry = true;
  }
}
