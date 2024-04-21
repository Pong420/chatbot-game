import { createHandler } from '@line/handler';
import { Group, TextEqual } from '@line/filter';
import { updateGame } from '@/supabase/game';
import { t } from '@werewolf/locales';
import {
  Stage,
  Init,
  Start,
  Guard,
  Night,
  Daytime,
  Witcher,
  Predictor,
  Hunter,
  Vote,
  Voted,
  End,
  ReVote,
  VoteBaseStage
} from '@werewolf/stage';
import { IsHost } from '../filter';
import * as board from '../board';

export function getStageMessage(stage: Stage) {
  if (stage instanceof Init) return board.start();
  if (stage instanceof Start) return board.players(stage.players.values());
  if (stage instanceof Guard) return board.guardGroup();
  if (stage instanceof Night) return board.werewolfGroup();
  if (stage instanceof Witcher) return board.witcherGroup();
  if (stage instanceof Predictor) return board.predictorGroup();
  if (stage instanceof Hunter) return board.hunterGroup();
  if (stage instanceof Daytime) return board.daytime(stage);
  if (stage instanceof Vote) return board.vote(stage);
  if (stage instanceof ReVote) return board.revote(stage);
  if (stage instanceof Voted) return board.voted(stage);
  if (stage instanceof End) return null;
}

export default [
  createHandler(Group, TextEqual(t('Open')), IsHost, async ({ game }) => {
    if (game.stage instanceof Init) {
      const stage = game.next();
      await updateGame(game);
      return getStageMessage(stage);
    }
  }),
  createHandler(Group, TextEqual([t('Next'), t('NextShort')]), IsHost, async ({ game }) => {
    try {
      game.next();
      await updateGame(game);
    } catch {}

    return getStageMessage(game.stage);
  }),
  createHandler(Group, TextEqual(t(`WhoNotVoted`)), IsHost, async ({ game }) => {
    const stage = game.stage;
    if (stage instanceof VoteBaseStage) {
      const names = stage.voter.filter(id => !stage.voted.includes(id)).map(id => game.getPlayer(id).nickname);
      if (!names.length) return;
      return t(`WhoNotVotedReply`, names.join('，'));
    }
  })
];
