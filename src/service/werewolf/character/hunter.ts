import { Action } from '@werewolf/decorators';
import { Killed } from '../death';
import { t } from '../locales';
import { Hunter as HunterStage } from '../stage';
import { Character } from './_character';

export class Hunter extends Character {
  readonly type = 'Hunter';
  readonly name = t('Hunter');
  readonly good = true;

  shot?: string;

  get canShoot() {
    return this.causeOfDeath.filter(cause => cause instanceof Killed).length >= 1;
  }

  @Action(() => HunterStage)
  shoot(character: Character) {
    if (!this.canShoot) throw t(`NotReadyForShoot`);
    if (character.isDead) throw t(`CantKillDeadTarget`, character.nickname);
    if (this.id === character.id) throw t(`ShootSelf`);
    this.shot = character.id;
    character.dead(Killed, { userId: this.id });
    return t(`ShootSuccess`);
  }

  @Action(() => HunterStage)
  noShoot() {
    delete this.shot;
    return t(`NoShootSuccess`);
  }
}
