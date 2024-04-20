import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Hunter } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsCharacter, IsPlayer, TargetPlayer } from '../filter';
import * as board from '../board';

const IsHunter = IsCharacter(Hunter);

export default [
  createHandler(Group, TextEqual(t('IamHunter')), IsPlayer, () => t(`IamHunterGroup`)),
  createHandler(Single, TextEqual(t('IamHunter')), IsHunter, ({ game }) =>
    board.hunter(game.stage.survivors.map(survivor => survivor.nickname))
  ),
  createHandler(Single, TargetPlayer(t('Shoot')), IsHunter, async (target, { game, character }) => {
    const message = character.shoot(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual(t('NoShoot')), IsHunter, async ({ game, character }) => {
    const message = character.noShoot();
    await updateGame(game);
    return message;
  })
];
