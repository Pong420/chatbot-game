import { Stage } from './_stage';
import { Night } from './night';
import { Guard as GuardCharacter } from '../character';
import { Witcher as WitcherStage } from './witcher';
import { Predictor as PredictorStage } from './predictor';

export class Guard extends Stage {
  readonly name = 'Guard';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(GuardCharacter, stage.survivors).length;
  }

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof GuardCharacter) {
        player.endTurn = false;
      }
    });
  }

  next(): typeof Stage {
    return WitcherStage.available(this) ? WitcherStage : PredictorStage.available(this) ? PredictorStage : Night;
  }
}
