import { NextRequest, NextResponse } from 'next/server';
import { client, runMiddleware, WebhookEvent, WebhookRequestBody } from './client';

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

async function handleEvent(event: WebhookEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  if (!event.source.userId) {
    throw new Error(`userId not found`);
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: 'text',
        text: event.message.text
      }
    ]
  });
}
