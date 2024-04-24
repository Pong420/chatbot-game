import { Stage } from './_stage';

export class Daytime extends Stage {
  readonly name = 'Daytime';

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.updateSurvivors();
    this.turn += 1;
    this.survivors.forEach(survivor => {
      survivor.turn = this.turn;
    });
  }
}
