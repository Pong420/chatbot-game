import { t as lt } from '@line/locales';
import { createHandler } from '@line/handler';
import { CanStartGame, Game, Group, Single, TextEqual, User, UserId } from '@line/filter';
import { createGame, updateGame } from '@/supabase/game';
import { updateUser } from '@/supabase/user';
import { Character } from '@werewolf/character';
import { Werewolf } from '@werewolf/game';
import { Daytime, Init, Night, Stage, Start } from '@werewolf/stage';
import { t } from '@werewolf/locales';
import * as board from './board';

const WerewolfGame = Game(Werewolf);

function getStageMessage(stage: Stage) {
  if (stage instanceof Init) return board.start();
  if (stage instanceof Start) return board.players(stage.players.values());
  if (stage instanceof Night) return board.night('');
  if (stage instanceof Daytime) return board.daytime('');
}

export const werewolfMainHandlers = [
  createHandler(Group, TextEqual(t('Initiate')), UserId(), CanStartGame(), async (event, userId) => {
    const groupId = event.source.groupId;
    const game = Werewolf.create({ groupId });
    game.stage.host = userId;

    const resp = await createGame({ type: Werewolf.type, ...game.serialize() });
    if (resp.error) return t('SystemError');

    return getStageMessage(game.stage);
  }),
  createHandler(Group, TextEqual(t('Open')), WerewolfGame, async (event, game) => {
    if (game.stage instanceof Init) {
      const stage = game.next();
      await updateGame(game.groupId, game.serialize());
      return getStageMessage(stage);
    }
  }),
  createHandler(Group, TextEqual([t('Next'), t('NextShort')]), UserId(), WerewolfGame, async (event, userId, game) => {
    if (userId && game.stage.host === userId) {
      const stage = game.next();
      await updateGame(game.groupId, game.serialize());
      return getStageMessage(stage);
    }
  }),
  createHandler(Group, TextEqual(t('Join')), User(), WerewolfGame, async (event, user, game) => {
    if (user.game && user.game !== game.groupId) return lt(`JoinedOtherGroupsGame`, user.nickname);

    if (game.stage instanceof Init) return t('NotStarted');

    game.stage.as(Start).join({ id: user.userId, nickname: user.nickname });

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
  createHandler(Single, TextEqual(t('MyCharacter')), User(), WerewolfGame, async (user, game) => {
    const character = game.players.get(user.userId);
    if (!character) return t(`NotJoined`);
    if (character.name === Character.type) return t(`NotStarted`);
    return board.myCharacter(character);
  })
];

export default werewolfMainHandlers;
