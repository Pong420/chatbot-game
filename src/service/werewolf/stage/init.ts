import { Stage } from './_stage';
import { t } from '../locales';

export class Init extends Stage {
  readonly name = 'Init';

  onEnd(): void {
    if (this.characters.length) {
      this.numOfPlayers = this.characters.length;
    }

    if (this.numOfPlayers !== 'flexible') {
      if (this.numOfPlayers < 6) throw t('NoEnoughPlayers', 6);
    }
  }
}
