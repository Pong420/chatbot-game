import { createHandler } from '@line/handler';
import { Group, Single, TextEqual } from '@line/filter';
import { t } from '@werewolf/locales';
import { Villager } from '@werewolf/character';
import { IsPlayer, createWerewolfFilter } from '../filter';

const IsVillager = createWerewolfFilter(Villager);

export default [
  createHandler(Group, TextEqual(t('IamVillager')), IsPlayer, () => t(`IamVillagerGroup`)),
  createHandler(Single, TextEqual(t('IamVillager')), IsVillager(), () => t(`YouAreVillager`))
];
