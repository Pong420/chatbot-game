import {
  FlexMessage,
  FlexComponent,
  FlexText as _FlexText,
  FlexSeparator,
  FlexFiller,
  FlexButton
} from '@line/bot-sdk';

// FIXME:
type FlexText = Exclude<_FlexText, { text?: never }>;

export type Payload = string | FlexText;

interface OnCloumnData {
  payload: Payload;
  columns: Payload[];
  colIndex: number;
  rows: Payload[][];
  rowIndex: number;
}

// eslint-disable-next-line no-unused-vars
export type OnCloumn = (component: FlexText | FlexFiller, options: OnCloumnData) => FlexComponent | undefined;

export interface CreateTableMessageProps {
  title?: Payload[];
  footer?: (Payload | FlexButton)[];
  rows: Payload[][];
  fillCol?: number;
  onCloumn?: OnCloumn;
  buttons?: FlexButton[];
}

export const centeredText = createFlexText({ align: 'center' });
export const wrapedText = createFlexText({ wrap: true });
export const wrapAndCenterText = createFlexText({
  wrap: true,
  align: 'center'
});

export function createFlexText(defaultOptions?: Partial<FlexText>) {
  return function (text: Payload, options?: Partial<FlexText> | number): FlexText {
    return {
      ...defaultOptions,
      ...(typeof options === 'object' && options),
      ...(typeof text === 'string' ? { text } : text),
      type: 'text'
    };
  };
}

export function createTableMessage({
  title = [],
  footer = [],
  fillCol = 0,
  onCloumn,
  rows,
  buttons
}: CreateTableMessageProps): FlexMessage {
  const margin: FlexText['margin'] = 'md';
  const size: FlexText['size'] = 'sm';
  const separator: FlexSeparator = { type: 'separator', margin };

  const contents = rows.reduce<FlexComponent[]>((contents, row, rowIndex) => {
    const _row = fillCol ? [...row, ...new Array<Payload>(fillCol).fill('')].slice(0, fillCol) : row;
    const content: FlexComponent = {
      type: 'box',
      layout: 'horizontal',
      spacing: 'none',
      margin,
      contents: [
        ..._row
          .map<FlexComponent | undefined>((payload, index) => {
            const data = typeof payload === 'string' ? { text: payload } : payload;
            const component: FlexComponent = !!payload
              ? {
                  align: index === 0 ? 'start' : 'center',
                  type: 'text',
                  margin: 'none',
                  size,
                  ...data
                }
              : { type: 'filler' };

            return onCloumn
              ? onCloumn(component, {
                  payload,
                  rows: rows,
                  rowIndex,
                  columns: row,
                  colIndex: index
                })
              : component;
          })
          .filter((s): s is FlexComponent => !!s)
      ]
    };

    const separators: FlexComponent[] = rows.length - 1 !== rowIndex || footer.length ? [separator] : [];

    return [...contents, content, ...separators];
  }, []);

  const [titleContents, footerContents] = [title, footer].map<FlexComponent[]>((row, index) => {
    const contents = row.map<FlexComponent>(payload => {
      return payload
        ? typeof payload === 'object' && payload.type !== 'text'
          ? payload
          : {
              margin: 'sm',
              size,
              ...(typeof payload === 'string' ? { text: payload } : payload),
              type: 'text'
            }
        : { type: 'filler' };
    });

    let result: FlexComponent[] = contents.length
      ? [
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'none',
            margin,
            contents
          }
        ]
      : [];

    if (index === 0 && result.length) {
      result = [...contents, separator];
    }

    return result;
  });

  return {
    type: 'flex',
    altText: 'Flex Message',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'none',
        margin: 'none',
        paddingAll: 'xl',
        contents: [...titleContents, ...contents, ...footerContents]
      },
      footer: buttons
        ? {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: buttons
          }
        : undefined
    }
  };
}
