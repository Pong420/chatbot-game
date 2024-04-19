import { Stage } from './_stage';
import { Vote } from './_vote';
import { Daytime } from './daytime';

export class ReVote extends Vote {
  readonly name = 'ReVote';

  static available(stage: Stage): typeof Stage | undefined {
    if (stage instanceof Daytime) {
      return !!stage.candidates.size ? Daytime : undefined;
    }
    return undefined;
  }

  onStart(): void {
    super.onStart();

    this.survivors.forEach(survivor => {
      survivor.endTurn = this.candidates.has(survivor.id);
    });
  }
}
