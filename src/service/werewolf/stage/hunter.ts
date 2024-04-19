import { Stage } from './_stage';
import { Hunter as HunterCharacter } from '../character';
import { Voted } from './voted';

export class Hunter extends Stage {
  readonly name = 'Hunter';

  ref: 'daytime' | 'vote';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(HunterCharacter, stage.players).filter(c => c.canShoot).length
      ? Hunter
      : undefined;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.players.forEach(player => {
      if (player instanceof HunterCharacter && player.canShoot) {
        player._canShoot = true;
        player.endTurn = false;
      }
    });

    this.ref = stage instanceof Voted ? 'vote' : 'daytime';
  }
}
