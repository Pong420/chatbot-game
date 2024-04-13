import { t } from '../locales';
import { Character } from './_character';

export class Predictor extends Character {
  readonly type = 'Predictor';
  readonly name = t('Predictor');

  predicted: string[] = [this.id];

  predict(character: Character) {
    if (this.id === character.id) throw t(`PredictSelf`, character.nickname);
    if (this.predicted.includes(character.id)) throw t('Predicted', character.nickname);
    this.predicted.push(character.id);
    return t('PredictSuccess', character.nickname, character.name);
  }
}
