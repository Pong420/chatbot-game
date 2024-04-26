'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Character } from '@/app/werewolf/settings/utils';

export interface CharacterSelectorProps {
  characters: Character[];
}

export type CharacterCounterProps<T> = T & {
  name: string;
};

export function CharacterCounter<T>({ name }: CharacterCounterProps<T>) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex space-x-1">
      <Button variant="outline" onClick={() => setCount(c => c - 1)} disabled={count === 0}>
        -
      </Button>
      <Input className="text-center" type="number" id={name} name={name} value={count} readOnly />
      <Button variant="outline" onClick={() => setCount(c => c + 1)}>
        +
      </Button>
    </div>
  );
}

export function CharacterSelector({ characters }: CharacterSelectorProps) {
  return (
    <table className="mt-4 border-spacing-y-2 border-separate w-full">
      <tbody>
        {characters.map(c => {
          const name = c.key.toLowerCase();
          return (
            <tr key={c.key}>
              <td className="whitespace-nowrap pr-2">
                <Label htmlFor={name}>{c.name}</Label>
              </td>
              <td>
                <CharacterCounter name={name} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
