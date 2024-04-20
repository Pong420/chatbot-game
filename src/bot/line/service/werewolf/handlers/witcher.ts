import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { Witcher } from '@werewolf/character';
import { t } from '@werewolf/locales';
import { updateGame } from '@/supabase/game';
import { IsCharacter, IsPlayer, TargetPlayer } from '../filter';
import * as board from '../board';

const IsWitcher = IsCharacter(Witcher);

export default [
  createHandler(Group, TextEqual(t('IamWitcher')), IsPlayer, () => t(`IamWitcherGroup`)),
  createHandler(Single, TextEqual(t('IamWitcher')), IsWitcher, ({ game, character }) => {
    const nearDeath = game.stage.nearDeath.map(character => character.name);
    if (nearDeath.length && !character.rescued) {
      return board.rescue(nearDeath);
    }

    const targets = game.stage.survivors.reduce(
      (res, survivor) => (character.id === survivor.id ? res : [...res, character.name]),
      [] as string[]
    );
    if (!character.poisoned) {
      return board.poison(targets);
    }

    return t(`NoMoreMedicine`);
  }),
  createHandler(Single, TargetPlayer(t(`Rescue`)), IsWitcher, async (target, { game, character }) => {
    const message = character.rescue(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TargetPlayer(t(`Poison`)), IsWitcher, async (target, { game, character }) => {
    const message = character.poison(target);
    await updateGame(game);
    return message;
  }),
  createHandler(Single, TextEqual([t(`NoRescue`), t(`NoPoison`)]), IsWitcher, async ({ game, character }) => {
    const message = character.idle();
    await updateGame(game);
    return message;
  })
];
