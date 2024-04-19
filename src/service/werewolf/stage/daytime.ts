import { Vote } from './_vote';

export class Daytime extends Vote {
  readonly name = 'Daytime';

  onStart(): void {
    super.onStart();

    this.survivors.forEach(survivor => {
      this.candidates.set(survivor.id, []);
      survivor.endTurn = false;
    });
  }
}
