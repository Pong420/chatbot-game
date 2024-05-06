import { Action, FlexButton, MessageAction, PostbackAction, TextMessage } from '@line/bot-sdk';
import { wrapedText, FlexText } from './createTableMessage';

export * from './createTableMessage';

export const textMessage = (text: string) => ({ type: 'text', text }) satisfies TextMessage;

export function messageAction(label: string, text = label): MessageAction & { label: string } {
  return { type: 'message', text, label };
}

export const button = (props: Partial<FlexButton> & { action: Action }): FlexButton => ({
  height: 'sm',
  type: 'button',
  ...props
});

export const primaryButton = (action: Action) => button({ action, style: 'primary' });
export const secondaryButton = (action: Action) => button({ action, style: 'secondary' });

export const uriAction = (label: string, uri: string): Action => {
  return {
    uri,
    label,
    type: 'uri'
  };
};

export const liffAction = (label: string, uri: string): Action => {
  return {
    uri: liffUrl(uri),
    label,
    type: 'uri'
  };
};

export function liffUrl(pathname: string) {
  return `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}${pathname}`;
}

export const sendTextToBot = (label: string, text = label) => {
  const botId = process.env.LINE_BOT_ID || '';
  if (!botId) throw new Error(`botId not defined`);
  if (!botId.startsWith('@')) throw new Error(`botId should start with @`);
  return uriAction(label, `https://line.me/R/oaMessage/${encodeURIComponent(botId)}/?${encodeURIComponent(text)}`);
};

export function orderList(payload: (string | string[])[], startIdx = 1) {
  let no = startIdx;
  const results: FlexText[][] = [];
  const indicator = (value: string | number, visible = true) =>
    wrapedText(`${value}.`, {
      flex: 0,
      align: 'start',
      color: visible ? undefined : '#ffffff'
    });
  const content = (value: string) => wrapedText(`${value}`, { align: 'start', margin: 'md' });
  const placeholder = ' '.repeat(String(payload.length).length);

  for (const value of payload) {
    if (typeof value === 'string') {
      results.push([indicator(no), content(value)]);
    } else {
      const [head, ...rest] = value;
      results.push(
        [indicator(no), content(head)],
        ...rest.map(value => [indicator(placeholder, false), content(value)])
      );
    }
    no += 1;
  }

  return results;
}

export function postBackAction(data: unknown, displayText?: string): PostbackAction {
  return { type: 'postback', data: JSON.stringify(data), displayText };
}

export function postBackTextAction(label: string, text = label, displayText?: string) {
  return { label: label, ...postBackAction({ text }, displayText) };
}
