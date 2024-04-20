import { Action } from '@werewolf/decorators';
import { Killed, Poisoned } from '../death';
import { t } from '../locales';
import { Hunter as HunterStage } from '../stage';
import { Character } from './_character';

const HunterAction = Action(() => HunterStage, {
  turnEnded: (character: Hunter) => (character._canShoot === undefined ? t(`NotYourTurn`) : t(`TurnEnded`))
});

export class Hunter extends Character {
  readonly type = 'Hunter';
  readonly name = t('Hunter');
  readonly good = true;

  shot?: string; // userid
  _canShoot?: boolean;

  get canShoot() {
    return (
      !!this.causeOfDeath.length &&
      !this.causeOfDeath.find(cause => cause instanceof Poisoned) &&
      this._canShoot === undefined
    );
  }

  @HunterAction
  shoot(character: Character) {
    if (!this._canShoot) throw t(`NotReadyForShoot`);
    if (character.isDead) throw t(`CantKillDeadTarget`, character.nickname);
    if (this.id === character.id) throw t(`ShootSelf`);
    this._canShoot = false;
    this.shot = character.id;
    character.dead(Killed, { userId: this.id });
    return t(`ShootSuccess`);
  }

  @HunterAction
  noShoot() {
    this._canShoot = false;
    return t(`NoShootSuccess`);
  }
}