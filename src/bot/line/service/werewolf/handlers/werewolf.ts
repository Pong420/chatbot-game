import { randomOption } from '@/utils/random';
import { createHandler } from '@line/handler';
import { Group, Single, TextEqual, TextMatch } from '@line/filter';
import { Werewolf } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { IsCharacter, IsPlayer } from '../filter';
import * as board from '../board';

const IsWerewolf = IsCharacter(Werewolf);

// TODO: test "我要殺{killerName}" instead of "我要自殺"

export const werewolfHandlers = [
  createHandler(Group, TextEqual(t('IamWerewolf')), IsPlayer, async () =>
    randomOption([`喂，是警察叔叔嗎，這裏有狼人哇`, `欸，我也是耶，「嗷嗚~~」`, `「嗷嗚~~」`])
  ),
  createHandler(Single, TextEqual(t('IamWerewolf')), IsWerewolf, async ({ userId, game }) =>
    board.werewolf(game, userId)
  ),
  createHandler(Single, TextMatch(t('Kill')), IsWerewolf, async ([, name], { game, character }) => {
    const target = game.stage.playersByName[name];
    character.kill(game.players.get(target.id)!, name);
    return t(`KillSuccss`);
  })
];

export default werewolfHandlers;
