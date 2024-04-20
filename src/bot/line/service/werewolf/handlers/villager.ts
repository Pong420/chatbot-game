import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { t } from '@werewolf/locales';
import { Villager } from '@werewolf/character';
import { IsCharacter, IsPlayer } from '../filter';

export default [
  createHandler(Group, TextEqual(t('IamVillager')), IsPlayer, () => t(`IamVillagerGroup`)),
  createHandler(Single, TextEqual(t('IamVillager')), IsCharacter(Villager), () => t(`YouAreVillager`))
];
