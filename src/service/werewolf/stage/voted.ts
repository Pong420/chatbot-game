import { Stage } from './_stage';
import { Dark } from './dark';
import { VoteResult } from './daytime';

export class Voted extends Stage {
  readonly name = 'Voted';

  results: VoteResult;

  next(): typeof Stage {
    return Dark;
  }
}
