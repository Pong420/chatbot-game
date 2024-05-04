import { characterMap } from '../character';
import { t } from '../locales';
import { Stage } from './_stage';

export class Init extends Stage {
  readonly name = 'Init';

  get minPlayers() {
    return this.numOfPlayers === -1 ? 6 : this.numOfPlayers;
  }

  onEnd(): void {
    if (this.game.customCharacters?.length) {
      this.characters = this.game.customCharacters.map(key => characterMap[key]).filter(Boolean);
      this.numOfPlayers = this.characters.length;

      if (this.numOfPlayers < this.minPlayers) throw t('NoEnoughPlayers', this.minPlayers);
    }
  }
}
