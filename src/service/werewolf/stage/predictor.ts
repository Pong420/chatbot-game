import { Stage } from './_stage';
import { Predictor as PredictorCharacter } from '../character';

export class Predictor extends Stage {
  readonly name = 'Predictor';

  static available(stage: Stage) {
    return !!stage.getPlayersByCharacter(PredictorCharacter, stage.players).length ? Predictor : undefined;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.survivors.forEach(survivor => {
      if (survivor instanceof PredictorCharacter) {
        // if all survivors predicted, player turn should be ended
        survivor.endTurn = this.survivors.every(s => survivor.predicted.includes(s.id));
        survivor.predictedAll = survivor.endTurn;
      }
    });
  }
}
