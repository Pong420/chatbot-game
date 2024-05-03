import { WebhookEvent } from '@line/bot-sdk';
import { isGroupEvent } from '@line/types';
import { createHandler } from '@line/handler';
import { loadHanlders } from '@line/utils/loadHandlers';
import { Init, Start } from '@werewolf/stage';
import { updateGame } from '@service/game';
import { WerewolfGame } from './filter';
import { getStageMessage } from './handlers/host';

const handlers = await loadHanlders(
  process.env.NODE_ENV === 'test'
    ? import.meta.glob('./handlers/*.ts')
    : { pathname: 'src/bot/line/service/werewolf/handlers', load: pathname => import(`./handlers/${pathname}`) }
);

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  ...handlers,
  /**
   * Auto update game stage if anyone sent a menssage in the group
   * This function should put at last, prevents blocked the other handler
   */
  createHandler(
    (event: WebhookEvent) => isGroupEvent(event) && event.type === 'message',
    WerewolfGame,
    async game => {
      if (!game.autoMode) return;
      if (game.stage instanceof Init || game.stage instanceof Start) return;
      try {
        game.next();
        await updateGame(game);
        return getStageMessage(game);
      } catch (error) {}
    }
  )
];
