import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../locales';
import { Killed } from '../death';
import { Night } from '../stage';

export class Werewolf extends Character {
  hungry = false;

  @Action(() => Night)
  kill(character: Character) {
    const suicide = this.id === character.id;

    if (character.isDead) throw t('TargetIsDead', character.id === this.id ? t('Self') : character.name);
    if (character.isKilledBy(this)) throw t(suicide ? 'DuplicatedSuicide' : 'DuplicatedKill');

    character.dead(Killed, { userId: this.id });
    this.hungry = !suicide;

    return { suicide };
  }

  @Action(() => Night)
  idle() {
    if (this.hungry) throw t('Hungry');
    this.hungry = true;
  }

  @Action(() => Night)
  suicide() {
    return this.kill(this);
  }
}
