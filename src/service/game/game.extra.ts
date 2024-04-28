import { GameInstance, updateGame, GameStatus } from './game';
import { updateUser } from './user';

// FIXME:
// not sure why cannot be mocked
// put back to game.ts

export async function endGame(game: GameInstance, players: Iterable<string>) {
  await updateGame(game.id, { data: game.serialize(), status: GameStatus.CLOSE });
  await Promise.all(Array.from(players, id => updateUser(id, { game: null }).catch(() => void 0)));
}
