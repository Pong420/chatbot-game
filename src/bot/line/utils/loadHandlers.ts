import getConfig from 'next/config';
import { Handler } from '@line/handler';

interface Context {
  pathname: string;
  load: (pathname: string) => Promise<unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isContext = (payload: any): payload is Context => payload.pathname && typeof payload.pathname === 'string';

export async function loadHanlders(payload: Context | Record<string, () => Promise<unknown>>) {
  const handlers: Handler[] = [];
  const addHandler = (mod: unknown) => {
    if (mod && typeof mod === 'object' && 'default' in mod && mod.default && Array.isArray(mod.default)) {
      handlers.push(...mod.default);
    }
  };

  if (isContext(payload)) {
    const dirs = getConfig().serverRuntimeConfig.context[payload.pathname];
    if (!dirs) throw `${payload.pathname} not defined`;

    for (const dir of dirs) {
      addHandler(await payload.load(dir));
    }
  } else {
    for (const path in payload) {
      addHandler(await payload[path]());
    }
  }

  return handlers;
}
