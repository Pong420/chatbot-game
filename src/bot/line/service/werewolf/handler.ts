import { loadHanlders } from '@line/utils/loadHandlers';

export default await loadHanlders(
  process.env.NODE_ENV === 'test'
    ? import.meta.glob('./handlers/*.ts')
    : { pathname: 'src/bot/line/service/werewolf/handlers', load: pathname => import(`./handlers/${pathname}`) }
);
