import { Stage } from './_stage';
import { Night } from './night';
import { Guard } from './guard';
import { VoteResult } from './daytime';

export class Voted extends Stage {
  readonly name = 'Voted';

  results: VoteResult;

  next(): typeof Stage {
    return Guard.available(this) || Night;
  }
}
