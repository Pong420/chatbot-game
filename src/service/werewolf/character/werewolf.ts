import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../locales';
import { Killed } from '../death';
import { Night } from '../stage';

export class Werewolf extends Character {
  readonly type = 'Werewolf';
  readonly name = t('Werewolf');

  // as records, target could rescued or procteded
  killed: string[] = [];

  hungry = false;

  protected _kill(character?: Character, nickname = '') {
    if (!character) throw t(`TargetNoExists`, nickname);

    const suicide = this.id === character.id;
    if (character.isDead) throw t('CantKillDeadTarget', character.id === this.id ? t('Self') : character.nickname);
    if (character.isKilledBy(this)) throw suicide ? t('DuplicatedSuicide') : t('DuplicatedKill');

    character.dead(Killed, { userId: this.id });
    this.killed.push(character.id);
    this.hungry = this.hungry ? !this.suicide : false;
  }

  @Action(() => Night)
  kill(character?: Character, nickname = '') {
    this._kill(character, nickname);
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
