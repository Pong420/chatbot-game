import { Stage } from './_stage';
import { Night } from './night';
import { Witcher as WitcherCharacter } from '../character';
import { Predictor as PredictorStage } from './predictor';

export class Witcher extends Stage {
  readonly name = 'Witcher';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(WitcherCharacter, stage.survivors).length;
  }

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof WitcherCharacter) {
        player.endTurn = !!player.rescued && !!player.poisoned;
      }
    });
  }

  next(): typeof Stage {
    return PredictorStage.available(this) ? PredictorStage : Night;
  }
}
