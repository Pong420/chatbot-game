import { Stage } from './_stage';
import { Start } from './start';

/**
 * For configuration in the future
 */
export class Init extends Stage {
  readonly name = 'Init';

  next(): typeof Stage {
    return Start;
  }
}
