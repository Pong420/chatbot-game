import { nanoid } from 'nanoid';
import { expect, test } from 'vitest';
import { createEventHandler } from '@line/handler';
import { LineUser } from '@line/test';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { werewolfMainHandlers } from './main';
import * as board from './board';

const groupId = nanoid();
const client = new LineUser({ groupId });
const clients = Array.from({ length: 11 }, () => new LineUser({ groupId }));
const handleEvent = createEventHandler(werewolfMainHandlers);

const Initiate = (c = client) => handleEvent(c.groupMessage(t(`Initiate`)));
const Join = (c = client) => handleEvent(c.groupMessage(t(`Join`)));

test('main', async () => {
  await expect(Initiate()).resolves.toEqual(board.start());
  await expect(Initiate()).resolves.toMatchObject(textMessage(lt(`OtherGameRuning`, Werewolf.type)));

  await expect(Join()).resolves.toMatchObject({ type: 'flex' });
  await expect(Join()).resolves.toEqual(textMessage(t(`Joined`, client.name)));

  for (const client of clients) {
    await expect(Join(client)).resolves.toMatchObject({ type: 'flex' });
    await expect(Join(client)).resolves.toEqual(textMessage(t(`Joined`, client.name)));
  }
});
