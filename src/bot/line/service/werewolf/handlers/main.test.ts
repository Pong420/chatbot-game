/* eslint-disable @typescript-eslint/no-unused-vars */
import { test } from 'vitest';
import { Werewolf as WerewolfGame } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { testSuite, WerewolfPlayer } from '../test';
import * as board from '../board';

declare let game: WerewolfGame;
declare let survivors: WerewolfPlayer[];
declare let villagers: WerewolfPlayer[];
declare let werewolfs: WerewolfPlayer[];
declare let werewolf: WerewolfPlayer;
declare let hunters: WerewolfPlayer[];
declare let hunter: WerewolfPlayer;
declare let guards: WerewolfPlayer[];
declare let guard: WerewolfPlayer;
declare let predictors: WerewolfPlayer[];
declare let predictor: WerewolfPlayer;
declare let witchers: WerewolfPlayer[];
declare let witcher: WerewolfPlayer;
declare let players: WerewolfPlayer[];
declare let host: WerewolfPlayer;

test('main', async () => {
  const { createGame, next } = testSuite();
  await createGame();

  // --------------------------------------------------------------------------------

  await next(board.guardGroup());

  await guard.s(t('IamGuard')).toEqual(board.guard(game));
  await guard.s(t.regex('Protect', villagers[0].name)).toTextMessage(t(`ProtectSuccess`));

  // --------------------------------------------------------------------------------

  await next(board.werewolfGroup());

  for (const werewolf of werewolfs) {
    await werewolf.s(t(`IamWerewolf`)).toEqual(board.werewolf(game, werewolf.userId));
    await werewolf.s(t.regex(`Kill`, villagers[0].name)).toTextMessage(t(`KillSuccss`));
  }

  // --------------------------------------------------------------------------------

  await next(board.witcherGroup());

  await witcher.s(t(`IamWitcher`)).toEqual(board.rescue(game, witcher.userId));
  await witcher.s(t.regex(`Rescue`, villagers[0].name)).toTextMessage(t(`RescueSuccess`));

  // --------------------------------------------------------------------------------

  await next(board.predictorGroup());

  await predictor.s(t(`IamPredictor`)).toEqual(board.predictor(game, predictor.userId));
  await predictor
    .s(t.regex(`Predict`, villagers[0].name))
    .toTextMessage(t(`PredictResult`, villagers[0].name, t('PredictedGoodGuy')));

  // --------------------------------------------------------------------------------

  await next(board.daytime(''));
});
