import { Stage } from './_stage';
import { VoteBaseStage } from './_vote_base';

export class Vote extends VoteBaseStage {
  readonly name = 'Vote';

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.updateSurvivors();
    this.survivors.forEach(survivor => {
      this.candidates.set(survivor.id, []);
      survivor.endTurn = false;
    });
  }
}
