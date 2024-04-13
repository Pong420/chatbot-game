import { Action } from '@werewolf/decorators';
import { Killed } from '../death';
import { t } from '../locales';
import { Hunter as HunterStage } from '../stage';
import { Character } from './_character';

export class Hunter extends Character {
  readonly type = 'Hunter';
  readonly name = t('Hunter');

  shot?: string;
  canShot = false;

  @Action(() => HunterStage)
  shoot(character: Character) {
    if (!this.canShot) throw t(`NotReadyForShoot`);
    if (this.id === character.id) throw t(`ShootSelf`);
    this.canShot = false;
    this.shot = character.id;
    character.dead(Killed, { userId: this.id });
    return t(`ShootSuccess`);
  }

  @Action(() => HunterStage)
  noShoot() {
    this.canShot = false;
    this.shot = undefined;
    return t(`NoShootSuccess`);
  }
}
