import { Stage } from './_stage';
import { Daytime } from './daytime';
import { Werewolf } from '../character';

export class Night extends Stage {
  readonly name = 'Night';

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof Werewolf) {
        player.endTurn = false;
      }
    });
  }

  next() {
    return Daytime;
  }
}
