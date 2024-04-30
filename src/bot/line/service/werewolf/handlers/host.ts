import { createHandler } from '@line/handler';
import { Group, TextEqual, TextMatch } from '@line/filter';
import { endGame, updateGame } from '@service/game';
import { t } from '@werewolf/locales';
import { Werewolf } from '@werewolf/game';
import {
  Init,
  Start,
  Guard,
  Night,
  Daytime,
  Witcher,
  Predictor,
  Hunter,
  HunterEnd,
  Vote,
  Voted,
  End,
  ReVote
} from '@werewolf/stage';
import { IsHost } from '../filter';
import { getDeathReport, getDetailReport } from '../report';
import * as board from '../board';

export function getStageMessage(game: Werewolf) {
  const { stage } = game;
  if (stage instanceof Init) return board.initiate(game.id);
  if (stage instanceof Start) return board.players(stage);
  if (stage instanceof Guard) return board.guardGroup();
  if (stage instanceof Night) return board.werewolfGroup();
  if (stage instanceof Witcher) return board.witcherGroup();
  if (stage instanceof Predictor) return board.predictorGroup();
  if (stage instanceof Hunter) return board.hunterGroup();
  if (stage instanceof HunterEnd) return board.hunterEnd(stage);
  if (stage instanceof Daytime) return board.daytime(stage);
  if (stage instanceof Vote) return board.vote(game);
  if (stage instanceof ReVote) return board.revote(game);
  if (stage instanceof Voted) return board.voted(stage);
  if (stage instanceof End) return board.end(stage);
}

export default [
  createHandler(Group, TextEqual(t('SetupCompleted')), IsHost, async ({ game }) => {
    if (!(game.stage instanceof Init)) return;
    game.next();
    await updateGame(game);
    return board.settings(game.stage);
  }),
  createHandler(Group, TextEqual(t.raw('Start')), IsHost, async ({ game }) => {
    if (!(game.stage instanceof Start)) return;
    game.next();
    await updateGame(game);
    return board.start(game);
  }),
  createHandler(Group, TextEqual(t.raw(`End`)), IsHost, async ({ game }) => {
    await endGame(game, game.players.keys());
    return board.ended();
  }),
  createHandler(Group, TextEqual([t('Next'), t('NextShort')]), IsHost, async ({ game }) => {
    try {
      game.next();
      await updateGame(game);
    } catch (error) {
      if (error !== t(`StageNotEnded`)) throw error;
    }
    return getStageMessage(game);
  }),
  createHandler(Group, TextEqual(t('Skip')), IsHost, async ({ game }) => {
    game.skip();
    await updateGame(game);
    return getStageMessage(game);
  }),
  createHandler(Group, TextEqual(t(`WhoNotVoted`)), IsHost, async ({ game }) => board.notVoted(game.stage)),
  createHandler(Group, TextEqual(t(`Survivors`)), IsHost, async ({ game }) => board.survivors(game.stage)),
  createHandler(Group, TextEqual(t('DeathReport')), IsHost, async ({ game }) => {
    if (!(game.stage instanceof End)) return t(`CannotShowReport`);
    return getDeathReport(game);
  }),
  createHandler(Group, TextMatch(t(`PlayerReport`)), IsHost, async ([, name], { game }) => {
    if (!(game.stage instanceof End)) return t(`CannotShowReport`);
    const target = game.getPlayer(name);
    if (!target) return t(`TargetNoExists`, name);
    return getDetailReport(target, game);
  })
];
