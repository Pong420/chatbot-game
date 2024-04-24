/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, test } from 'vitest';
import { Werewolf as WerewolfGame } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { testSuite, WerewolfPlayer } from '../test';
import * as board from '../board';

declare let game: WerewolfGame;
declare let stage: WerewolfGame['stage'];
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
  const { createGame, next, update, allVoteTo } = testSuite();
  await createGame();

  // Guard --------------------------------------------------------------------------------

  await next(board.guardGroup());

  await guard.s(t('IamGuard')).toEqual(board.guard(game));
  await guard.s(t.regex('Protect', villagers[0].name)).toTextMessage(t(`ProtectSuccess`));
  await guard.s(t.regex('Protect', villagers[0].name)).toTextMessage(t(`TurnEnded`));

  // Night --------------------------------------------------------------------------------

  await next(board.werewolfGroup());

  for (const werewolf of werewolfs.slice(0, -1)) {
    await werewolf.s(t(`IamWerewolf`)).toEqual(board.werewolf(game, werewolf.userId));
    await werewolf.s(t.regex(`Kill`, villagers[0].name)).toTextMessage(t(`KillSuccss`));
    await werewolf.s(t.regex(`Kill`, villagers[0].name)).toTextMessage(t(`TurnEnded`));
  }

  await werewolfs.slice(-1)[0].s(t(`Idle`)).toTextMessage(t(`WerewolfIdleSuccess`));

  // TODO:
  // await hunter.s(t(`IamHunter`)).toTextMessage(t(`NotReadyForShoot`));
  await hunter.s(t.regex(`Shoot`, werewolfs[0].name)).toTextMessage(t(`NotReadyForShoot`));

  // Witcher --------------------------------------------------------------------------------

  await next(board.witcherGroup());

  await witcher.s(t(`IamWitcher`)).toEqual(board.rescue(stage));
  await witcher.s(t(`ShowRescueBoard`)).toEqual(board.rescue(stage));
  await witcher.s(t(`ShowPoisonBoard`)).toEqual(board.poison(stage, witcher.userId));
  await witcher.s(t.regex(`Rescue`, villagers[0].name)).toTextMessage(t(`RescueSuccess`));
  await witcher.s(t.regex(`Rescue`, villagers[0].name)).toTextMessage(t(`TurnEnded`));
  await werewolfs[0].s(t(`ShowRescueBoard`)).toBeUndefined();
  await werewolfs[0].s(t(`ShowPoisonBoard`)).toBeUndefined();

  // Predictor --------------------------------------------------------------------------------

  await next(board.predictorGroup());

  await predictor.s(t(`IamPredictor`)).toEqual(board.predictor(game, predictor.userId));
  await predictor
    .s(t.regex(`Predict`, villagers[0].name))
    .toTextMessage(t(`PredictResult`, villagers[0].name, t('PredictedGoodGuy')));

  // Daytime --------------------------------------------------------------------------------

  await next(() => board.daytime(game.stage));

  // Vote --------------------------------------------------------------------------------

  await next(() => board.vote(game.stage));
  await host.g(t(`WhoNotVoted`)).toEqual(board.notVoted(stage));
  await next(() => board.vote(game.stage));
  await allVoteTo(werewolfs[3]);

  // Voted --------------------------------------------------------------------------------

  await next(() => board.voted(game.stage));
  expect(survivors).toHaveLength(10);

  // Guard --------------------------------------------------------------------------------

  await next(board.guardGroup());
  await guard.s(t.regex('Protect', villagers[0].name)).toTextMessage(t(`TargetIsDead`, villagers[0].name));
  await guard.s(t('ProtectSelf')).toTextMessage(t(`ProtectSelfSuccess`));

  // Night --------------------------------------------------------------------------------

  await next(board.werewolfGroup());
  await werewolfs[0].s(t.regex(`Kill`, hunter.name)).toTextMessage(t(`KillSuccss`));
  await werewolfs[1].s(t.regex(`Idle`)).toTextMessage(t(`WerewolfIdleSuccess`));
  await werewolfs[2].s(t.regex(`Suicide`)).toTextMessage(t(`SuicideSuccss`));

  // Witcher --------------------------------------------------------------------------------

  await next(board.witcherGroup());
  await witcher.s(t(`IamWitcher`)).toEqual(board.poison(stage, witcher.userId));
  await witcher.s(t(`ShowRescueBoard`)).toTextMessage(t(`Rescued`));
  await witcher.s(t(`NotUseMedicine`)).toTextMessage(t(`NotUseMedicineSuccessSuccess`));

  // Predictor --------------------------------------------------------------------------------

  await next(board.predictorGroup());
  await predictor.s(t(`IamPredictor`)).toEqual(board.predictor(game, predictor.userId));
  await predictor
    .s(t.regex(`Predict`, witcher.name))
    .toTextMessage(t(`PredictResult`, witcher.name, t(`PredictedGoodGuy`)));

  // Daytime --------------------------------------------------------------------------------

  await next(() => board.daytime(stage));

  // Hunter --------------------------------------------------------------------------------

  await next(board.hunterGroup());
  await hunter.s(t(`IamHunter`)).toEqual(board.hunter(stage, hunter.userId));
  await hunter.s(t.regex(`Shoot`, hunter.name)).toTextMessage(t('ShootSelf'));
  await hunter.s(t.regex(`Shoot`, guard.name)).toTextMessage(t('ShootSuccess'));

  // HunterEnd --------------------------------------------------------------------------------

  await next(() => board.hunterEnd(stage));

  // Vote --------------------------------------------------------------------------------

  await next(() => board.vote(game.stage));
  await allVoteTo(predictor);

  // Voted --------------------------------------------------------------------------------

  await next(() => board.voted(game.stage));

  // Night --------------------------------------------------------------------------------

  await next(board.werewolfGroup());
  await werewolfs[0].s(t.regex(`Kill`, werewolfs[1].name)).toTextMessage(t(`KillSuccss`));
  await werewolfs[1].s(t.regex(`Idle`)).toTextMessage(t(`Hungry`));
  await werewolfs[1].s(t.regex(`Kill`, witcher.name)).toTextMessage(t(`KillSuccss`));

  // Witcher --------------------------------------------------------------------------------

  await next(board.witcherGroup());
  await witcher.s(t(`IamWitcher`)).toEqual(board.poison(stage, witcher.userId));
  await witcher.s(t.regex(`Poison`, villagers[2].name)).toTextMessage(t(`PoisonSuccess`));

  // Daytime --------------------------------------------------------------------------------

  await next(() => board.daytime(stage));

  // Vote --------------------------------------------------------------------------------

  await next(() => board.vote(stage));
  await allVoteTo(villagers[1]);

  // Voted --------------------------------------------------------------------------------

  await next(() => board.voted(stage));

  // Ended --------------------------------------------------------------------------------

  await next(() => board.ended(stage));
});
