import { Stage } from './_stage';
import { Night } from './night';
import { Witcher as WitcherCharacter } from '../character';

export class Witcher extends Stage {
  readonly name = 'Witcher';

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof WitcherCharacter) {
        player.endTurn = !!player.rescued && !!player.poisoned;
      }
    });
  }

  next() {
    return Night;
  }
}
