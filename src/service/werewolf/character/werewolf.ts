import { Character } from './_character';
import { Action } from '../decorators';
import { t } from '../locales';
import { Night } from '../stage';

export type WerewolfDecision = { type: 'kill'; target: string } | { type: 'idle' };

export class Werewolf extends Character {
  readonly type = 'Werewolf';
  readonly name = t('Werewolf');
  readonly good = false;

  // as records, target could rescued or protected
  killed: string[] = [];

  hungry = false;

  knowEachOthers = false;
  decision?: WerewolfDecision;

  protected _kill(character: Character) {
    const suicide = this.id === character.id;
    if (character.isDead) throw t('CantKillDeadTarget', character.id === this.id ? t('Self') : character.nickname);
    if (character.isKilledBy(this)) throw suicide ? t('DuplicatedSuicide') : t('DuplicatedKill');
    this.decision = { type: 'kill', target: character.id };
  }

  @Action(() => Night)
  kill(character: Character) {
    this._kill(character);
    return t('KillSuccss');
  }

  @Action(() => Night)
  idle() {
    if (this.hungry) throw t('Hungry');
    this.decision = { type: 'idle' };
    return t('IdleSuccess');
  }

  @Action(() => Night)
  suicide() {
    this._kill(this);
    return t('SuicideSuccss');
  }
}
