import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Hunter } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@service/game/game';
import { IsPlayer, createWerewolfFilter } from '../filter';
import * as board from '../board';

const IsHunter = createWerewolfFilter(Hunter);

export default [
  createHandler(Group, TextEqual(t('IamHunter')), IsPlayer, () => t(`IamHunterGroup`)),
  createHandler(
    Single,
    TextEqual(t('IamHunter')),
    IsHunter({ turnEndedError: true, yourAreNotError: true }),
    ({ game, character }) => board.hunter(game.stage, character.id)
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
