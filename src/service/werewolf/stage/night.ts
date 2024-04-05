import { Werewolf } from '../character';
import { Stage } from './_stage';
import { Daytime } from './daytime';

export class Night extends Stage {
  onStart(): void {
    super.onStart();
    this.turn += 1;
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
