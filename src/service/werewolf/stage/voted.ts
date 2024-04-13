import { Stage } from './_stage';
import { Night } from './night';
import { VoteResult } from './daytime';

export class Voted extends Stage {
  readonly name = 'Voted';

  results: VoteResult;

  next() {
    return Night;
  }
}
