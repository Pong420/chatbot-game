import { Stage } from './_stage';
import { Night } from './night';
import { Guard as GuardCharacter } from '../character';

export class Guard extends Stage {
  readonly name = 'Guard';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(GuardCharacter, stage.survivors).length;
  }

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof GuardCharacter) {
        player.endTurn = false;
      }
    });
  }

  next() {
    return Night;
  }
}
