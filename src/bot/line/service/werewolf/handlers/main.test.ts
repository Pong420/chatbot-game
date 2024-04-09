import { expect, test } from 'vitest';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { Werewolf as WerewolfGame } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { getGame } from '@/supabase/game';
import { getCharacters, groupId, players, createLineUser } from '../test';
import * as board from '../board';

const host = players[0];

const dupClient = createLineUser({ name: players[0].name, groupId });
const extraClient = createLineUser({ groupId });
const clientInOthersGroup = createLineUser({ name: players[0].name });
clientInOthersGroup.profile.userId = players[0].userId;

test('main', async () => {
  await host.s(t(`Initiate`)).toBeUndefined();
  await host.g(t(`Initiate`)).toEqual(board.start());
  await host.g(t(`Initiate`)).toEqual(textMessage(lt(`OtherGameRuning`, WerewolfGame.type)));

  await host.g(t(`Join`)).toEqual(textMessage(t(`WaitFotHostSetup`)));
  await host.g(t(`Open`)).toMatchObject(board.players([]));

  await host.g(t('Join')).toMatchObject({ type: 'flex' });
  await host.g(t('Join')).toEqual(textMessage(t(`Joined`, host.name)));

  await dupClient.g(t('Join')).toEqual(textMessage(t('NicknameUsed', dupClient.name)));

  for (const client of players) {
    if (client === host) continue;
    await client.g(t('Join')).toMatchObject({ type: 'flex' });
    await client.g(t('Join')).toEqual(textMessage(t(`Joined`, client.name)));
  }

  await extraClient.g(t('Join')).toEqual(textMessage(t('GameIsFull', extraClient.name)));

  await clientInOthersGroup.g(t(`Initiate`)).toEqual(board.start());
  await clientInOthersGroup.g(t('Join')).toTextMessage(lt('JoinedOtherGroupsGame', clientInOthersGroup.name));

  await host.g(t(`Next`)).toMatchObject(board.night(''));

  const resp = await getGame(players[0].groupId);
  const game = WerewolfGame.create(resp.data!);

  const { werewolfs, villagers } = getCharacters(game, players);

  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);

  for (const werewolf of werewolfs) {
    await werewolf.s(t.regex(`Kill`, villagers[0].name)).toTextMessage(t(`KillSuccss`));
  }
});
