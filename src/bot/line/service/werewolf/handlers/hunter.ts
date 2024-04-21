import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Hunter } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsHunter = createWerewolfFilter(Hunter);

export default [
  createHandler(Group, TextEqual(t('IamHunter')), IsPlayer, () => t(`IamHunterGroup`)),
  createHandler(Single, TextEqual(t('IamHunter')), IsHunter({ yourAreNotError: true }), ({ game }) =>
    board.hunter(game.stage.survivors.map(survivor => survivor.nickname))
  ),
  createHandler(Single, IsHunter({ target: t('Shoot') }), async ({ game, target, character }) => {
    const message = character.shoot(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('NoShoot')), IsHunter(), async ({ game, character }) => {
    const message = character.noShoot();
    await updateGame(game);
    return message;
  })
];
