import { Character } from './_character';
import { Action } from '../decorators';
import { errors } from '../error';

export class Werewolf extends Character {
  character = 'werewolf';

  hungry = false;

  killed: string[] = [];

  @Action()
  kill(character: Character) {
    character.dead(this);
    this.killed.push(character.id);
    this.hungry = false;
  }

  @Action()
  idle() {
    if (this.hungry) throw errors('HUNGRY');
    this.hungry = true;
  }
}
