import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Guard } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsCharacter, IsPlayer, TargetPlayer } from '../filter';
import * as board from '../board';

const IsGuard = IsCharacter(Guard);

export default [
  createHandler(Group, TextEqual(t('IamGuard')), IsPlayer, () => t(`IamGuardGroup`)),
  createHandler(Single, TextEqual(t('IamGuard')), IsGuard, ({ game }) =>
    board.guard(game.stage.survivors.map(survivor => survivor.nickname))
  ),
  createHandler(Single, TargetPlayer(t('Protect')), IsGuard, async (target, { game, character }) => {
    const message = character.protect(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('ProtectSelf')), IsGuard, async ({ game, character }) => {
    const message = character.protect(character);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('NoProtect')), IsGuard, async ({ game, character }) => {
    const message = character.noProtect();
    await updateGame(game);
    return message;
  })
];
