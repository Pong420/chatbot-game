import { Stage } from './_stage';
import { Hunter as HunterCharacter } from '../character';
import { Voted } from './voted';

export class Hunter extends Stage {
  readonly name = 'Hunter';

  ref: 'daytime' | 'vote';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(HunterCharacter, stage.survivors).filter(c => c.canShoot).length
      ? Hunter
      : undefined;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.survivors.forEach(survivor => {
      if (survivor instanceof HunterCharacter) {
        survivor.endTurn = !survivor.canShoot;
      }
    });

    this.ref = stage instanceof Voted ? 'vote' : 'daytime';
  }
}
