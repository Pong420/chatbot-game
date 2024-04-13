import { Stage } from './_stage';
import { Daytime } from './daytime';
import { Hunter as HunterCharacter } from '../character';

// TODO:
export class Hunter extends Stage {
  readonly name = 'Hunter';

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof HunterCharacter) {
        player.endTurn = false;
      }
    });
  }

  next() {
    return Daytime;
  }
}
