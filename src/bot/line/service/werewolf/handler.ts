import mainHandlers from './handlers/main';
import werewolfHandlers from './handlers/werewolf';

export const werewolfGameHandlers = [...mainHandlers, ...werewolfHandlers];
