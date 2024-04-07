import { expect, test } from 'vitest';
import { createEventHandler } from '@line/handler';
import { LineUser } from '@line/test';
import { t as lt } from '@line/locales';
import { textMessage } from '@line/utils/createMessage';
import { Werewolf } from '@werewolf/game';
import { t } from '@werewolf/locales';
import { werewolfMainHandlers } from './main';
import * as board from './board';

const client = new LineUser();
const handleEvent = createEventHandler(werewolfMainHandlers);

const Initiate = () => handleEvent(client.groupMessage(t(`Initiate`)));

test('main', async () => {
  await expect(Initiate()).resolves.toEqual(board.start());
  await expect(Initiate()).resolves.toMatchObject(textMessage(lt(`OtherGameRuning`, Werewolf.type)));
});
