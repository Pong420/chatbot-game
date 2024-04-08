import { NextResponse } from 'next/server';
import { messagingApi, middleware } from '@line/bot-sdk';

type MiddlewareParams = Parameters<ReturnType<typeof middleware>>;
type LineRequest = MiddlewareParams[0];
type LineResponse = MiddlewareParams[1];

const channelSecret = process.env.LINE_CHANNEL_SECRET || '';
const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

if (!channelSecret) throw new Error(`channel secret not found`);
if (!channelAccessToken) throw new Error(`channel access token not found`);

export const client = new messagingApi.MessagingApiClient({
  channelAccessToken
});

export const runMiddleware = (req: unknown, res: unknown) =>
  middleware({ channelSecret, channelAccessToken })(req as LineRequest, res as LineResponse, () => NextResponse.next());
