import { Werewolf } from '../character';
import { Stage } from './_stage';
import { Daytime } from './daytime';

export class Night extends Stage {
  onStart(): void {
    this.players.forEach(player => {
      if (player instanceof Werewolf) {
        player.endTurn = false;
      }
    });
  }

  next() {
    return Daytime;
  }
}
