import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Predictor } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsCharacter, IsPlayer, TargetPlayer } from '../filter';
import * as board from '../board';

const IsPredictor = IsCharacter(Predictor);

export default [
  createHandler(Group, TextEqual(t('IamPredictor')), IsPlayer, () => t(`IamPredictorGroup`)),
  createHandler(Single, TextEqual(t('IamPredictor')), IsPredictor, ({ game, character }) =>
    board.predictor(character, game.stage.survivors, character.predictedAll)
  ),
  createHandler(Single, TargetPlayer(t('Predict')), IsPredictor, async (target, { game, character }) => {
    const message = character.predict(target);
    await updateGame(game);
    return message;
  })
];
