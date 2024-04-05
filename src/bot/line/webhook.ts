import { NextRequest, NextResponse } from 'next/server';
import { WebhookRequestBody } from '@line/bot-sdk';
import { runMiddleware } from './client';
import { Handler, createEventHandler } from './handler';
import { testHandlers } from './service/test';

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

const handlers: Handler[] = [...testHandlers];

const handleEvent = createEventHandler(handlers);
