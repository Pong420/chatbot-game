import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../locales';
import { Killed } from '../death';
import { Night } from '../stage';

export class Werewolf extends Character {
  readonly type = 'Werewolf';
  readonly name = t('Werewolf');
  readonly good = false;

  // as records, target could rescued or protected
  killed: string[] = [];

  hungry = false;
  knowEachOthers = false;

  protected _kill(character: Character) {
    const suicide = this.id === character.id;
    if (character.isDead) throw t('CantKillDeadTarget', character.id === this.id ? t('Self') : character.nickname);
    if (character.isKilledBy(this)) throw suicide ? t('DuplicatedSuicide') : t('DuplicatedKill');

    if (character.isProtected.length) {
      character.isProtected = character.isProtected.slice(0, -1);
    } else {
      character.dead(Killed, { userId: this.id });
    }

    this.killed.push(character.id);
    this.hungry = false;
  }

  @Action(() => Night)
  kill(character: Character) {
    this._kill(character);
    return t('KillSuccss');
  }

  @Action(() => Night)
  idle() {
    if (this.hungry) throw t('Hungry');
    this.hungry = true;
    return t('IdleSuccess');
  }

  @Action(() => Night)
  suicide() {
    this._kill(this);
    return t('SuicideSuccss');
  }
}
