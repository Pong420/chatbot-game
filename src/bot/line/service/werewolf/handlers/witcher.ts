import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Witcher } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsWitcher = createWerewolfFilter(Witcher);

export default [
  createHandler(Group, TextEqual(t('IamWitcher')), IsPlayer, () => t(`IamWitcherGroup`)),
  createHandler(Single, TextEqual(t('IamWitcher')), IsWitcher({ yourAreNotError: true }), ({ game, character }) => {
    return board.rescue(game, character.id) || board.poison(game, character.id) || t(`NoMoreMedicine`);
  }),
  createHandler(Single, IsWitcher({ target: t(`Rescue`) }), async ({ game, target, character }) => {
    const message = character.rescue(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, IsWitcher({ target: t(`Poison`) }), async ({ game, target, character }) => {
    const message = character.poison(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual([t(`NoRescue`), t(`NoPoison`)]), IsWitcher(), async ({ game, character }) => {
    const message = character.idle();
    await updateGame(game);
    return message;
  })
];
