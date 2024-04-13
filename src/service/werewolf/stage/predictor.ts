import { Stage } from './_stage';
import { Daytime } from './daytime';
import { Predictor as PredictorCharacter } from '../character';

export class Predictor extends Stage {
  readonly name = 'Predictor';

  onStart(): void {
    super.onStart();
    this.survivors.forEach(player => {
      if (player instanceof PredictorCharacter) {
        // if all survivors predicted, player turn should be ended
        player.endTurn = this.survivors.every(survivor => player.predicted.includes(survivor.id));
      }
    });
  }

  next() {
    return Daytime;
  }
}
