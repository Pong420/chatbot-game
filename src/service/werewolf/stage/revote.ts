import { Stage } from './_stage';
import { VoteBaseStage } from './_vote_base';
import { Vote } from './vote';

export class ReVote extends VoteBaseStage {
  readonly name = 'ReVote';

  static available(stage: Stage): typeof Stage | undefined {
    if (stage instanceof Vote) {
      return !!stage.candidates.size ? Vote : undefined;
    }
    return undefined;
  }

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.survivors.forEach(survivor => {
      survivor.endTurn = this.candidates.has(survivor.id);
      !survivor.endTurn && this.voter.push(survivor.id);
    });
  }
}
