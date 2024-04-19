import { Stage } from './_stage';
import { Vote } from './_vote';

export class Daytime extends Vote {
  readonly name = 'Daytime';

  onStart(stage: Stage): void {
    super.onStart(stage);

    this.survivors.forEach(survivor => {
      this.candidates.set(survivor.id, []);
      survivor.endTurn = false;
    });
  }
}
