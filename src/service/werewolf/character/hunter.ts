import { Action } from '@werewolf/decorators';
import { Killed, Poisoned } from '../death';
import { t } from '../locales';
import { Hunter as HunterStage } from '../stage';
import { Character } from './_character';

const HunterAction = Action(() => HunterStage, {
  actionAfterDead: true,
  notYourTurn: () => t(`NotReadyForShoot`),
  turnEnded: (character: Hunter) => (character._canShoot === undefined ? t(`NotReadyForShoot`) : t(`TurnEnded`))
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
    if (this.id === character.id) throw t(`ShootSelf`);
    if (character.isDead) throw t(`CantKillDeadTarget`, character.nickname);
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
