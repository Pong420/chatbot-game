import { Action } from '@werewolf/decorators';
import { t } from '../locales';
import { Predictor as PredictorStage } from '../stage';
import { Character } from './_character';

export class Predictor extends Character {
  readonly type = 'Predictor';
  readonly name = t('Predictor');

  predicted: string[] = [];

  @Action(() => PredictorStage)
  predict(character: Character) {
    if (character.isDead) throw t(`TargetIsDead`, character.nickname);
    if (this.id === character.id) throw t(`PredictSelf`, character.nickname);
    if (this.predicted.includes(character.id)) throw t('Predicted', character.nickname, character.name);
    this.predicted.push(character.id);
    return t('PredictSuccess', character.nickname, character.name);
  }
}
