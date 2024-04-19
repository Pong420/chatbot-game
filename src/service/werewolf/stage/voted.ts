import { Stage } from './_stage';
import { VoteResult } from './_vote';

export class Voted extends Stage {
  readonly name = 'Voted';
  results: VoteResult;
}
