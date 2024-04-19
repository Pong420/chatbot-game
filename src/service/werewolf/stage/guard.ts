import { Stage } from './_stage';
import { Guard as GuardCharacter } from '../character';

export class Guard extends Stage {
  readonly name = 'Guard';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(GuardCharacter, stage.survivors).length ? Guard : undefined;
  }

  onStart(): void {
    super.onStart();

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
