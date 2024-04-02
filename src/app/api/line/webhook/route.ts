import { NextRequest, NextResponse } from 'next/server';
import { messagingApi, middleware, MessageEvent } from '@line/bot-sdk';
import {
  Request as LineRequest,
  Response as LineResponse,
} from '@line/bot-sdk/dist/middleware';
import { Event } from '@line/bot-sdk/dist/webhook/api';

const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

if (!channelSecret) throw new Error(`channel secret not found`);
if (!channelAccessToken) throw new Error(`access token not found`);

const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

export async function POST(req: NextRequest, res: NextResponse) {
  await middleware({ channelSecret, channelAccessToken })(
    req as unknown as LineRequest,
    res as unknown as LineResponse,
    () => NextResponse.next()
  );

  if (req.body && 'events' in req.body) {
    const events = req.body.events as MessageEvent[];
    events.forEach(handleEvent);
    return Response.json({ ok: true });
  }

  return new Response(`Invalid`, { status: 400 });
}

function handleEvent(event: MessageEvent) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: 'text',
        text: event.message.text,
      },
    ],
  });
}
