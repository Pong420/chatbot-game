import { t as lt } from '@line/locales';
import { createHandler } from '@line/handler';
import { CanStartGame, Game, Group, Single, TextEqual, User } from '@line/filter';
import { createGame, getGame, updateGame } from '@/supabase/game';
import { updateUser } from '@/supabase/user';
import { Werewolf } from '@werewolf/game';
import { Start } from '@werewolf/stage';
import { t } from '@werewolf/locales';
import * as board from './board';

const WerewolfGame = Game(Werewolf);

export const werewolfMainHandlers = [
  createHandler(Group, TextEqual(t('Initiate')), CanStartGame(), async event => {
    const groupId = event.source.groupId;
    const game = Werewolf.create({ id: groupId });
    const resp = await createGame({ type: Werewolf.type, groupId, data: Werewolf.serialize(game).stage });
    if (resp.error) return t('SystemError');
    return board.start();
  }),
  createHandler(Group, TextEqual(t('Join')), User(), WerewolfGame, async (event, user, game) => {
    if (user.game && user.game !== game.id) return lt(`JoinedOtherGroupGame`);

    game.stage.as(Start).join({ id: user.userId, name: user.nickname });

    await Promise.all([
      updateUser(user.userId, { game: game.id }),
      updateGame(game.id, { data: Werewolf.serialize(game).stage })
    ]);

    return board.players(game.players.values());
  }),
  createHandler(Single, TextEqual(t('MyCharacter')), User(), async user => {
    if (!user.game) return; // ignore
    const resp = await getGame(user.game);
    if (resp.error) return t(`SystemError`);
    if (resp.data.type !== Werewolf.type) return;
    const game = Werewolf.create({ id: user.game, stage: resp.data });
    const character = game.players.get(user.userId);

    // TODO:
    return character?.name;
  })
];

export default werewolfMainHandlers;
