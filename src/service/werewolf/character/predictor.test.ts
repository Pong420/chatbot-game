import { testSuite } from '@werewolf/test';
import { expect, test } from 'vitest';
import { Predictor } from './predictor';
import { Werewolf } from './werewolf';
import { Villager } from './villager';
import { Game } from '../game';
import { stages } from '../stage';
import { t } from '../locales';

declare let game: Game;
declare let werewolves: Werewolf[];
declare let villagers: Villager[];
declare let predictors: Predictor[];

test('predictor', () => {
  const { createGame, nextStage, allVoteTo } = testSuite();

  createGame({
    customCharacters: ['Werewolf', 'Predictor', 'Villager', 'Villager', 'Villager', 'Villager', 'Villager', 'Villager']
  });
  expect(game.stage).toBeInstanceOf(stages.Start);

  nextStage('Night');
  expect(predictors[0]).toBeInstanceOf(Predictor);
  expect(() => predictors[0].predict(werewolves[0])).toThrowError(t(`NotYourTurn`));
  werewolves[0].kill(villagers[0]);

  nextStage('Predictor');

  expect(() => predictors[0].predict(predictors[0])).toThrowError(t('PredictSelf', predictors[0].nickname));
  expect(predictors[0].predict(villagers[0])).toEqual(t('PredictResult', villagers[0].nickname, t(`PredictedGoodGuy`)));
  expect(predictors[0].predicted).toHaveLength(1);
  expect(() => predictors[0].predict(villagers[1])).toThrowError(t('TurnEnded'));

  nextStage('Daytime');

  nextStage('Vote');
  allVoteTo(villagers[1]);

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].idle();

  nextStage('Predictor');

  // cannot predict dead target
  expect(() => predictors[0].predict(villagers[1])).toThrowError(t('TargetIsDead', villagers[1].nickname));
  expect(predictors[0].predict(werewolves[0])).toEqual(
    t('PredictResult', werewolves[0].nickname, t(`PredictedBadGuy`))
  );
  expect(predictors[0].predicted).toHaveLength(2);

  nextStage('Daytime');

  nextStage('Vote');
  allVoteTo(villagers[2]);

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].kill(predictors[0]);

  nextStage('Predictor');

  // target is killed by werewolf but haven't confirmed
  expect(predictors[0].isKilledBy(werewolves[0])).toBeTrue();
  expect(() => predictors[0].predict(werewolves[0])).toThrowError(
    t('Predicted', werewolves[0].nickname, t(`PredictedBadGuy`))
  );
  expect(predictors[0].predict(villagers[3])).toEqual(t('PredictResult', villagers[3].nickname, t('PredictedGoodGuy')));

  nextStage('Daytime');
  expect(predictors[0].isDead).toBeTrue();

  nextStage('Vote');
  allVoteTo(villagers[3]);

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].idle();

  nextStage('Predictor');
  nextStage('Daytime');

  nextStage('Vote');
  allVoteTo(werewolves[0]);

  nextStage('Voted');

  nextStage('End');
});

test('predictor - all', () => {
  const { createGame, nextStage, allVoteTo } = testSuite();

  createGame({ customCharacters: ['Werewolf', 'Predictor', 'Villager', 'Villager', 'Villager', 'Villager'] });

  nextStage('Night');
  expect(predictors[0]).toBeInstanceOf(Predictor);
  werewolves[0].kill(villagers[0]);

  predictors[0].predicted = Array.from(game.players, ([id]) => id);

  nextStage('Predictor');

  expect(() => predictors[0].predict(werewolves[0])).toThrowError(t(`PredictedAll`));

  nextStage('Daytime');

  nextStage('Vote');
  allVoteTo(villagers[1]);

  nextStage('Voted');

  nextStage('Night');
  werewolves[0].idle();

  nextStage('Predictor');
});
