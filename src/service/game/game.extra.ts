import { deleteChat } from '@service/chat';
import { GameInstance, updateGame, GameStatus } from './game';
import { updateAchivement } from './achievement';
import { updateUser } from './user';

// FIXME:
// not sure why cannot be mocked
// put back to game.ts

export async function endGame(game: GameInstance, players: Iterable<string>) {
  await deleteChat({ gameId: game.id });

  // TODO: delete game
  await updateGame(game.id, { data: game.serialize(), status: GameStatus.CLOSE });
  await Promise.all(Array.from(players, id => updateUser(id, { game: null }).catch(() => void 0)));

  // side effect, ignore await and error
  game.getAchivement().map(args => updateAchivement(...args).catch(() => void 0));
}
