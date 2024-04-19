import { Stage } from './_stage';
import { VoteResult } from './daytime';

export class Voted extends Stage {
  readonly name = 'Voted';
  results: VoteResult;
}
