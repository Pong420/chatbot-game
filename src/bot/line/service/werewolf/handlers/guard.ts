import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Guard } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@service/game';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsGuard = createWerewolfFilter(Guard);

export default [
  createHandler(Group, TextEqual(t('IamGuard')), IsPlayer, () => t(`IamGuardGroup`)),
  createHandler(
    Single,
    TextEqual(t('IamGuard')),
    IsGuard({ turnEndedError: true, yourAreNotError: true }),
    ({ game, character }) => board.guard(game, character.id)
  ),
  createHandler(Single, IsGuard({ target: t('Protect') }), async ({ game, target, character }) => {
    const message = character.protect(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('ProtectSelf')), IsGuard(), async ({ game, character }) => {
    const message = character.protect(character);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('NoProtect')), IsGuard(), async ({ game, character }) => {
    const message = character.noProtect();
    await updateGame(game);
    return message;
  })
];
