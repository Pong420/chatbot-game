import { nanoid } from 'nanoid';
import { expect, test } from 'vitest';
import { createEventHandler } from '@line/handler';
import { LineUser } from '@line/test';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { Werewolf as WerewolfGame } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { getGame } from '@/supabase/game';
import { werewolfGameHandlers } from '../handler';
import { getCharacters } from '../test';
import * as board from '../board';

const groupId = nanoid();
const client = new LineUser({ groupId });
const clients = Array.from({ length: 11 }, () => new LineUser({ groupId }));
const handleEvent = createEventHandler(werewolfGameHandlers);

const CreateGame = async (c = client) => {
  await expect(Initiate(c)).resolves.toEqual(board.start());
  await expect(Initiate(c)).resolves.toMatchObject(textMessage(lt(`OtherGameRuning`, WerewolfGame.type)));
};

const Initiate = (c = client) => handleEvent(c.groupMessage(t(`Initiate`)));
const Open = (c = client) => handleEvent(c.groupMessage(t(`Open`)));
const Join = (c = client) => handleEvent(c.groupMessage(t(`Join`)));
const Next = (c = client) => handleEvent(c.groupMessage(t(`Next`)));

test('main', async () => {
  await CreateGame(client);

  await expect(Join(client)).resolves.toEqual(textMessage(t(`WaitFotHostSetup`)));

  await expect(Open(client)).resolves.toMatchObject({ type: 'flex' });

  await expect(Join(client)).resolves.toMatchObject({ type: 'flex' });
  await expect(Join(client)).resolves.toEqual(textMessage(t(`Joined`, client.name)));

  const dupClient = new LineUser({ name: client.name, groupId });
  await expect(Join(dupClient)).resolves.toEqual(textMessage(t('NicknameUsed', dupClient.name)));

  for (const client of clients) {
    await expect(Join(client)).resolves.toMatchObject({ type: 'flex' });
    await expect(Join(client)).resolves.toEqual(textMessage(t(`Joined`, client.name)));
  }

  const extraClient = new LineUser({ groupId });
  await expect(Join(extraClient)).resolves.toEqual(textMessage(t('GameIsFull', extraClient.name)));

  const clientInOthersGroup = new LineUser({ name: client.name });
  clientInOthersGroup.profile.userId = client.userId;
  await CreateGame(clientInOthersGroup);
  await expect(Join(clientInOthersGroup)).resolves.toEqual(textMessage(lt('JoinedOtherGroupsGame', client.name)));

  await expect(Next()).resolves.toMatchObject({ type: 'flex' });

  const resp = await getGame(client.groupId);
  const game = WerewolfGame.create(resp.data!);

  const { werewolfs, villagers } = getCharacters(game, [client, ...clients]);

  expect(werewolfs.length).toBeGreaterThanOrEqual(1);
  expect(villagers.length).toBeGreaterThanOrEqual(1);

  for (const werewolf of werewolfs) {
    await expect(handleEvent(werewolf.singleMessage(t.regex(`Kill`, villagers[0].name)))).resolves.toEqual(
      textMessage(t(`KillSuccss`))
    );
  }
});
