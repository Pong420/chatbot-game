import fs from 'fs/promises';
import path from 'path';
import { Message } from '@line/bot-sdk';

export const outdir = path.join(process.cwd(), '.temp', 'messages');

await fs.mkdir(outdir, { recursive: true });

let i = 1;
export async function saveMessages(messages: Message[]) {
  await fs.writeFile(path.join(outdir, `${i}.json`), JSON.stringify(messages, null, 2));
  i++;
}
