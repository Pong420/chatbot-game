import { Stage } from './_stage';
import { Hunter as HunterCharacter } from '../character';

export class Hunter extends Stage {
  readonly name = 'Hunter';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(HunterCharacter, stage.survivors).filter(c => c.canShoot).length
      ? Hunter
      : undefined;
  }

  onStart(): void {
    super.onStart();
    this.survivors.forEach(survivor => {
      if (survivor instanceof HunterCharacter) {
        survivor.endTurn = !survivor.canShoot;
      }
    });
  }
}
