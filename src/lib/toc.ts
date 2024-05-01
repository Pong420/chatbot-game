/* eslint-disable @typescript-eslint/no-explicit-any */
import { toc } from 'mdast-util-toc';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

const textTypes = ['text', 'emphasis', 'strong', 'inlineCode'];

function flattenNode(node: any) {
  const p: unknown[] = [];
  visit(node, node => {
    if (!textTypes.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(node: any, current: Item): any {
  if (!node) {
    return {};
  }

  if (node.type === 'paragraph') {
    visit(node, item => {
      if (item.type === 'link') {
        current.url = item.url;
        current.title = flattenNode(node);
      }

      if (item.type === 'text') {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === 'list') {
    current.items = node.children.map((i: any) => getItems(i, {} as Item));

    return current;
  } else if (node.type === 'listItem') {
    const heading = getItems(node.children[0], {} as Item);

    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node: any, file: any) => {
  const table = toc(node);
  const items = getItems(table.map, {} as Item);

  file.data = items;
};

export type TableOfContents = Items;

export async function getTableOfContents(content: string): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data;
}