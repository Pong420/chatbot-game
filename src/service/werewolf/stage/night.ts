import { Stage } from './_stage';
import { Werewolf } from '../character';

export class Night extends Stage {
  readonly name = 'Night';

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.survivors.forEach(survivor => {
      if (survivor instanceof Werewolf) {
        survivor.endTurn = false;
      }
    });
  }
}
