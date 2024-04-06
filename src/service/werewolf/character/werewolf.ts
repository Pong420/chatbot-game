import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../messages';
import { Killed } from '../death';
import { Night } from '../stage';

export class Werewolf extends Character {
  hungry = false;

  @Action(() => Night)
  kill(character: Character) {
    const suicide = this.id === character.id;

    if (character.isDead) throw t('TARGET_IS_DEAD');
    if (character.isKilledBy(this)) throw t(suicide ? 'DUPLICATE_SUICIDE' : 'DUPLICATE_KILL');

    character.dead(Killed, { userId: this.id });
    this.hungry = !suicide;

    return { suicide };
  }

  @Action(() => Night)
  idle() {
    if (this.hungry) throw t('HUNGRY');
    this.hungry = true;
  }

  @Action(() => Night)
  suicide() {
    return this.kill(this);
  }
}
