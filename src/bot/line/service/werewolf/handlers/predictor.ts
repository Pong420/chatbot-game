import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Predictor } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@service/game/game';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsPredictor = createWerewolfFilter(Predictor);

export default [
  createHandler(Group, TextEqual(t('IamPredictor')), IsPlayer, () => t(`IamPredictorGroup`)),
  createHandler(
    Single,
    TextEqual(t('IamPredictor')),
    IsPredictor({ turnEndedError: true, yourAreNotError: true }),
    ({ game, character }) => board.predictor(game, character.id)
  ),
  createHandler(Single, IsPredictor({ target: t('Predict') }), async ({ target, game, character }) => {
    const message = character.predict(target);
    await updateGame(game);
    return message;
  })
];
