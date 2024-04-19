import { Stage } from './_stage';
import { Werewolf } from '../character';

export class Night extends Stage {
  readonly name = 'Night';

  onStart(): void {
    super.onStart();
    this.survivors.forEach(survivor => {
      if (survivor instanceof Werewolf) {
        survivor.endTurn = false;
      }
    });
  }
}
