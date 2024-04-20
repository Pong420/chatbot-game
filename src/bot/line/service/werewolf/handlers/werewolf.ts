import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { updateGame } from '@/supabase/game';
import { Werewolf } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsWerewolf = createWerewolfFilter(Werewolf);

export default [
  createHandler(Group, TextEqual(t('IamWerewolf')), IsPlayer, () => t(`IamWerewolfGroup`)),
  createHandler(Single, TextEqual(t('IamWerewolf')), IsWerewolf(), ({ userId, game }) => board.werewolf(game, userId)),
  createHandler(Single, IsWerewolf({ target: t('Kill') }), async ({ game, target, character }) => {
    const message = character.kill(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('Suicide')), IsWerewolf(), async ({ game, character }) => {
    const message = character.suicide();
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('Idle')), IsWerewolf(), async ({ game, character }) => {
    const message = character.idle();
    await updateGame(game);
    return message;
  })
];
