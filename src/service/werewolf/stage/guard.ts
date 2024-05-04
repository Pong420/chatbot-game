import { Stage } from './_stage';
import { Guard as GuardCharacter } from '../character';

export class Guard extends Stage {
  readonly name = 'Guard';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(GuardCharacter, stage.players).length ? Guard : undefined;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);

    this.players.forEach(player => {
      player.isProtected = [];
    });

    this.survivors.forEach(survivor => {
      if (survivor instanceof GuardCharacter) {
        survivor.endTurn = false;
      }
    });
  }
}
