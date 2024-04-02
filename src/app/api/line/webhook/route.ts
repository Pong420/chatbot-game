import { NextRequest, NextResponse } from 'next/server';
import { messagingApi, middleware } from '@line/bot-sdk';
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

export async function GET(req: NextRequest, res: NextResponse) {
  const resp = await middleware({ channelSecret, channelAccessToken })(
    req as unknown as LineRequest,
    res as unknown as LineResponse,
    () => NextResponse.next()
  );

  console.log(resp, req.body);

  return Response.json({ channelSecret, channelAccessToken });
}
