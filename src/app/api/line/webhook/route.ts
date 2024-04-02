import { NextRequest, NextResponse } from 'next/server';
import {
  messagingApi,
  middleware,
  WebhookEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';
import {
  Request as LineRequest,
  Response as LineResponse,
} from '@line/bot-sdk/dist/middleware';

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
