import { Action } from '@werewolf/decorators';
import { t } from '../locales';
import { Predictor as PredictorStage } from '../stage';
import { Character } from './_character';

export class Predictor extends Character {
  readonly type = 'Predictor';
  readonly name = t('Predictor');
  readonly good = true;

  predicted: string[] = [];
  predictedAll = false;

  @Action(() => PredictorStage, {
    turnEnded: (character: Predictor) => (character.predictedAll ? t(`PredictedAll`) : t(`TurnEnded`))
  })
  predict(character: Character) {
    const self = this.id === character.id;
    if (character.isDead) throw self ? t('YouDead') : t('TargetIsDead', character.nickname);
    if (self) throw t(`PredictSelf`, character.nickname);
    if (this.predicted.includes(character.id)) throw t('Predicted', character.nickname, character.name);
    this.predicted.push(character.id);
    return t(character.good ? 'PredictResultGood' : 'PredictResultBad', character.nickname);
  }
}
