import { Stage } from './_stage';
import { Night } from './night';

export class Vote extends Stage {
  next() {
    return Night;
  }
}
