import { Stage } from './_stage';
import { Daytime } from './daytime';
import { Werewolf } from '../character';
import { Witcher as WitcherStage } from './witcher';
import { Predictor as PredictorStage } from './predictor';

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

  next(): typeof Stage {
    return WitcherStage.available(this) ? WitcherStage : PredictorStage.available(this) ? PredictorStage : Daytime;
  }
}
