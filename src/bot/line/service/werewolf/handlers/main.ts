import { t as lt } from '@line/locales';
import { createHandler } from '@line/handler';
import { Group, GroupId, LeaveGroup, Single, TextEqual, User, UserId } from '@line/filter';
import { createGame, endGame, GameStatus, getGame, updateGame, updateUser } from '@service/game';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { Init, Start } from '@werewolf/stage';
import { WerewolfGame, IsPlayer, IsCharacter } from '../filter';
import { getStageMessage } from './host';
import * as board from '../board';

export const mainHandlers = [
  createHandler(GroupId, TextEqual(t.raw('Initiate')), UserId, async (groupId, userId) => {
    let data = await getGame(groupId, { status: GameStatus.OPEN });
    let game: Werewolf;

    // if current game exists, turn it end
    if (data) {
      game = Werewolf.create(data);
      await endGame(game, game.players.keys());
    }

    game = Werewolf.create({ data: { groupId, host: userId } });
    data = await createGame({ groupId, type: Werewolf.type, status: GameStatus.OPEN, data: game.serialize() });

    if (!data) throw false;

    game.id = data.id;
    return getStageMessage(game);
  }),
  createHandler(Group, TextEqual(t('Join')), User, WerewolfGame, async (user, { game }) => {
    if (user.game && user.game !== game.groupId) return lt(`JoinedOtherGroupsGame`, user.nickname);
    if (game.stage instanceof Init) return t('WaitFotHostSetup');
    if (!(game.stage instanceof Start)) return t(`Started`);

    game.stage.join({ id: user.userId, nickname: user.nickname });

    await Promise.all([
      //
      updateUser(user.userId, { game: game.groupId }),
      updateGame(game)
    ]);

    return getStageMessage(game);
  }),
  createHandler(Single, TextEqual(t('MyCharacter')), IsPlayer, async ({ character }) => {
    return board.myCharacter(character);
  }),
  createHandler(Group, IsCharacter({ target: t(`Vote`) }), async ({ game, target, character }) => {
    character.vote(target);
    await updateGame(game);
    return board.vote(game);
  }),
  createHandler(Group, TextEqual(t(`Waive`)), IsPlayer, async ({ game, character }) => {
    character.waive();
    await updateGame(game);
    return board.vote(game);
  }),
  createHandler(LeaveGroup, WerewolfGame, async (event, { game }) => {
    await Promise.all(Array.from(game.players, ([id]) => updateUser(id, { game: null }).catch(() => void 0)));
  })
];

export default mainHandlers;
