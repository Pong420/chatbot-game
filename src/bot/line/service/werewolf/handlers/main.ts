import { t as lt } from '@line/locales';
import { createHandler } from '@line/handler';
import { CanStartGame, Group, GroupId, Single, TextEqual, User, UserId } from '@line/filter';
import { createGame, updateGame } from '@/supabase/game';
import { updateUser } from '@/supabase/user';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { Daytime, Init, Night, Stage, Start } from '@werewolf/stage';
import { WerewolfGame, IsHost, IsPlayer } from '../filter';
import * as board from '../board';

function getStageMessage(stage: Stage) {
  if (stage instanceof Init) return board.start();
  if (stage instanceof Start) return board.players(stage.players.values());
  if (stage instanceof Night) return board.night('');
  if (stage instanceof Daytime) return board.daytime('');
}

export const mainHandlers = [
  createHandler(GroupId, UserId, TextEqual(t('Initiate')), CanStartGame, async (groupId, userId) => {
    const game = Werewolf.create({ groupId });

    // FIXME:
    game.stage.host = userId;

    const resp = await createGame({ type: Werewolf.type, ...game.serialize() });
    if (resp.error) return t('SystemError');

    return getStageMessage(game.stage);
  }),
  createHandler(Group, TextEqual(t('Open')), IsHost, async ({ game }) => {
    if (game.stage instanceof Init) {
      const stage = game.next();
      // FIXME: handle error
      await updateGame(game.groupId, game.serialize());
      return getStageMessage(stage);
    }
  }),
  createHandler(Group, TextEqual([t('Next'), t('NextShort')]), IsHost, async ({ game }) => {
    const stage = game.next();
    // FIXME: handle error
    await updateGame(game.groupId, game.serialize());
    return getStageMessage(stage);
  }),
  createHandler(Group, TextEqual(t('Join')), User, WerewolfGame, async (user, game) => {
    if (user.game && user.game !== game.groupId) return lt(`JoinedOtherGroupsGame`, user.nickname);

    if (game.stage instanceof Init) return t('WaitFotHostSetup');
    else if (!(game.stage instanceof Start)) return t(`Started`);

    game.stage.join({ id: user.userId, nickname: user.nickname });

    await Promise.all([
      //
      updateUser(user.userId, { game: game.groupId }),
      updateGame(game.groupId, game.serialize())
    ]);

    if (game.players.size < 12) {
      return board.players(game.players.values());
    } else {
      return getStageMessage(game.next());
    }
  }),
  createHandler(Single, TextEqual(t('MyCharacter')), IsPlayer, async ({ character }) => {
    return board.myCharacter(character);
  })
];

export default mainHandlers;
