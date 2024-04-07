import { t as lt } from '@line/locales';
import { createHandler } from '@line/handler';
import { CanStartGame, Game, Group, Single, TextEqual, User } from '@line/filter';
import { createGame, updateGame } from '@/supabase/game';
import { updateUser } from '@/supabase/user';
import { Werewolf } from '@werewolf/game';
import { Start } from '@werewolf/stage';
import { t } from '@werewolf/locales';
import * as board from './board';

const WerewolfGame = Game(Werewolf);

export const werewolfMainHandlers = [
  createHandler(Group, TextEqual(t('Initiate')), CanStartGame(), async event => {
    const groupId = event.source.groupId;
    const game = Werewolf.create({ groupId });
    // TODO:
    game.next(); // skip Init stage

    const resp = await createGame({ type: Werewolf.type, ...game.serialize() });
    if (resp.error) return t('SystemError');

    return board.start();
  }),
  createHandler(Group, TextEqual(t('Join')), User(), WerewolfGame, async (event, user, game) => {
    if (user.game && user.game !== game.groupId) return lt(`JoinedOtherGroupsGame`, user.nickname);

    game.stage.as(Start).join({ id: user.userId, nickname: user.nickname });

    await Promise.all([
      //
      updateUser(user.userId, { game: game.groupId }),
      updateGame(game.groupId, game.serialize())
    ]);

    return board.players(game.players.values());
  }),
  createHandler(Single, TextEqual(t('MyCharacter')), User(), WerewolfGame, async (user, game) => {
    const character = game.players.get(user.userId);
    // TODO:
    return character?.nickname;
  })
];

export default werewolfMainHandlers;
