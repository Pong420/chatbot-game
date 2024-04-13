
import { Stage } from './_stage';
import { Start } from './start';
import { t } from '../locales';

export class Init extends Stage {
  readonly name = 'Init';

  next(): typeof Stage {
    if (this.characters.length) {
      this.numOfPlayers = this.characters.length;
    }

    if (this.numOfPlayers !== 'flexible') {
      if (this.numOfPlayers < 6) throw t('NoEnoughPlayers', 6);
    }

    return Start;
  }
}
