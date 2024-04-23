import { Character } from '@werewolf/character';
import { Stage } from './_stage';
import { Hunter } from './hunter';

export class HunterEnd extends Stage {
  readonly name = 'HunterEnd';

  ref: Hunter['ref'];

  shot: Character[];

  onStart(stage: Stage): void {
    super.onStart(stage);
    this.shot = this.nearDeath;
    this.updateSurvivors();
  }
}
