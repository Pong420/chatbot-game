import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { updateGame } from '@/supabase/game';
import { Werewolf } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { IsCharacter, IsPlayer, TargetPlayer } from '../filter';
import * as board from '../board';

const IsWerewolf = IsCharacter(Werewolf);

export default [
  createHandler(Group, TextEqual(t('IamWerewolf')), IsPlayer, async () => t(`IamWerewolfGroup`)),
  createHandler(Single, TextEqual(t('IamWerewolf')), IsWerewolf, async ({ userId, game }) =>
    board.werewolf(game, userId)
  ),
  createHandler(Single, TargetPlayer(t('Kill')), IsWerewolf, async (target, { game, character }) => {
    const message = character.kill(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('Suicide')), IsWerewolf, async ({ game, character }) => {
    const message = character.suicide();
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('Idle')), IsWerewolf, async ({ game, character }) => {
    const message = character.idle();
    await updateGame(game);
    return message;
  })
];
