import { createHandler } from '@line/handler';
import { Group, TextEqual } from '@line/filter';
import { GameStatus, updateGame } from '@/supabase/game';
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
import * as board from '../board';

export function getStageMessage(game: Werewolf) {
  const { stage } = game;
  if (stage instanceof Init) return board.initiate(game.groupId);
  if (stage instanceof Start) return board.players(stage.players.values());
  if (stage instanceof Guard) return board.guardGroup();
  if (stage instanceof Night) return board.werewolfGroup();
  if (stage instanceof Witcher) return board.witcherGroup();
  if (stage instanceof Predictor) return board.predictorGroup();
  if (stage instanceof Hunter) return board.hunterGroup();
  if (stage instanceof HunterEnd) return board.hunterEnd(stage);
  if (stage instanceof Daytime) return board.daytime(stage);
  if (stage instanceof Vote) return board.vote(stage);
  if (stage instanceof ReVote) return board.revote(stage);
  if (stage instanceof Voted) return board.voted(stage);
  if (stage instanceof End) return board.ended(stage);
}

export default [
  createHandler(Group, TextEqual(t('Open')), IsHost, async ({ game }) => {
    if (game.stage instanceof Init) {
      game.next();
      await updateGame(game);
      return getStageMessage(game);
    }
  }),
  createHandler(Group, TextEqual(t(`End`)), IsHost, async ({ game }) => {
    await updateGame(game.groupId, { status: GameStatus.CLOSE });
    return t(`End`);
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
  createHandler(Group, TextEqual(t(`Survivors`)), IsHost, async ({ game }) => board.survivors(game.stage))
];
