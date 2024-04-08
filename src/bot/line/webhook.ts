import { NextRequest, NextResponse } from 'next/server';
import { WebhookRequestBody } from '@line/bot-sdk';
import { runMiddleware } from './client';
import { createEventHandler } from './handler';
import { debugHandlers } from './handlers/debug';
import { nicknameHandlers } from './handlers/nickname';
import { werewolfGameHandlers } from './service/werewolf/handler';

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

const handleEvent = createEventHandler(debugHandlers, nicknameHandlers, werewolfGameHandlers);
