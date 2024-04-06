import { expect, test } from 'vitest';
import { nanoid } from 'nanoid';
import { plainToInstance } from 'class-transformer';
import { Constructable } from '@/types';
import { Character } from './_character';
import { Villager, Werewolf } from './_characters';
import { t } from '../messages';

const create = <C extends Character>(CharacterConstructor: Constructable<C>) =>
  plainToInstance(CharacterConstructor, { id: nanoid(), name: nanoid() });

test('Werewolf', async () => {
  const werewolf = create(Werewolf);
  const villager = create(Villager);

  werewolf.endTurn = false;
  werewolf.kill(villager);
  expect(villager.causeOfDeath).toHaveLength(1);
  expect(villager.isKilledBy(werewolf)).toBeTruthy();

  werewolf.endTurn = false;
  expect(() => werewolf.kill(villager)).toThrowError(t('DUPLICATE_KILL'));
});
