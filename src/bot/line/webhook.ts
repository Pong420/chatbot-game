import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import { client, runMiddleware } from './client';
import { Handler } from './createHandler';
import { textMessage } from './utils/createMessage';
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

async function handleEvent(event: WebhookEvent) {
  for (const handler of handlers) {
    if ('replyToken' in event) {
      const message = await handler(event);
      if (message) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: typeof message === 'string' ? [textMessage(message)] : Array.isArray(message) ? message : [message],
          notificationDisabled: true
        });
      }
    }
  }
}
