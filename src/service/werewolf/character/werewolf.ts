import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../locales';
import { Killed } from '../death';
import { Dark } from '../stage';

export class Werewolf extends Character {
  readonly type = 'Werewolf';
  readonly name = t('Werewolf');

  hungry = false;

  protected _kill(character?: Character, nickname = '') {
    if (!character) throw t(`TargetNoExists`, nickname);

    const suicide = this.id === character.id;
    if (character.isDead) throw t('TargetIsDead', character.id === this.id ? t('Self') : character.nickname);
    if (character.isKilledBy(this)) throw suicide ? t('DuplicatedSuicide') : t('DuplicatedKill');

    character.dead(Killed, { userId: this.id });
    this.hungry = !suicide;
  }

  @Action(() => Dark)
  kill(character?: Character, nickname = '') {
    this._kill(character, nickname);
    return t('KillSuccss');
  }

  @Action(() => Dark)
  idle() {
    if (this.hungry) throw t('Hungry');
    this.hungry = true;
    return t('IdleSuccess');
  }

  @Action(() => Dark)
  suicide() {
    this._kill(this);
    return t('SuicideSuccss');
  }
}
