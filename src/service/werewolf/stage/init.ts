import { characterMap } from '../character';
import { t } from '../locales';
import { Stage } from './_stage';

const minPlayers = 6;

export class Init extends Stage {
  readonly name = 'Init';

  onEnd(): void {
    if (this.game.customCharacters?.length) {
      this.characters = this.game.customCharacters.map(key => characterMap[key]).filter(Boolean);
      this.numOfPlayers = this.characters.length;

      if (this.numOfPlayers < minPlayers) throw t('NoEnoughPlayers', minPlayers);
    }
  }
}
