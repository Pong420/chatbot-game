import { NextRequest, NextResponse } from 'next/server';
import { WebhookRequestBody } from '@line/bot-sdk';
import { runMiddleware } from './client';
import { createEventHandler } from './handler';
import { loadHanlders } from './utils/loadHandlers';
import werewolfGameHandlers from './service/werewolf/handler';

const handlers = await loadHanlders(
  process.env.NODE_ENV === 'test'
    ? import.meta.glob('./handlers/*.ts')
    : { pathname: 'src/bot/line/handlers', load: pathname => import(`./handlers/${pathname}`) }
);

const handleEvent = createEventHandler(handlers, werewolfGameHandlers);

export async function POST(req: NextRequest, res: NextResponse) {
  await runMiddleware(req, res);
  try {
    const { events }: WebhookRequestBody = await req.json();
    await Promise.all(events.map(handleEvent));
    return Response.json({ ok: true });
  } catch (error) {
    return new Response(`Bad Request`, { status: 500 });
  }
}
