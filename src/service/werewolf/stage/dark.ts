import { Werewolf } from '../character';
import { Daytime } from './daytime';
import { Night } from './night';

export class Dark extends Night {
  readonly name = 'Dark';

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
