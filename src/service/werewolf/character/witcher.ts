import { t } from '../locales';
import { Killed, Poisoned } from '../death';
import { Action } from '../decorators';
import { Witcher as WitcherStage } from '../stage';
import { Character } from './_character';

export class Witcher extends Character {
  readonly type = 'Witcher';
  readonly name = t('Witcher');

  /**
   * value should be player id
   */
  rescued?: string;
  poisoned?: string;

  @Action(() => WitcherStage)
  rescue(character: Character) {
    if (this.rescued) throw t(`Rescued`);
    if (character.isDead) throw t(`TargetIsDead`, character.nickname);

    const self = this.id === character.id;
    const index = character.causeOfDeath.findIndex(c => c instanceof Killed);
    if (index === -1) throw t(`TargetNotInjured`, character.nickname);

    this.rescued = character.id;
    character.causeOfDeath = [...character.causeOfDeath.slice(0, index), ...character.causeOfDeath.slice(index + 1)];

    return self ? t('RescueSelfSuccess') : t('RescueSuccess');
  }

  @Action(() => WitcherStage)
  poison(character: Character) {
    if (this.poisoned) throw t(`Poisoned`);
    if (character.isDead) throw t(`CantKillDeadTarget`, character.nickname);

    const self = this.id === character.id;

    this.poisoned = character.id;
    character.dead(Poisoned, { userId: this.id });
    return self ? t(`PoisonSelf`) : t('PoisonSuccess');
  }

  @Action(() => WitcherStage)
  idle() {
    //
  }
}
