import { Stage } from './_stage';
import { Witcher as WitcherCharacter } from '../character';

export class Witcher extends Stage {
  readonly name = 'Witcher';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(WitcherCharacter, stage.survivors).length ? Witcher : undefined;
  }

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof WitcherCharacter) {
        player.endTurn = !!player.rescued && !!player.poisoned;
      }
    });
  }
}
