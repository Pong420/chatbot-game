import { Stage } from './_stage';
import { Daytime } from './daytime';

export class ReVote extends Daytime {
  name = 'ReVote';

  static available(stage: Stage): typeof Stage | undefined {
    if (stage instanceof Daytime) {
      return !!stage.candidates.size ? Daytime : undefined;
    }
    return undefined;
  }
}
