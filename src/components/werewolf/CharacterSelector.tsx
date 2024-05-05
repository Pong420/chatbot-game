'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Character } from '@werewolf/utils';

export interface CharacterSelectorProps {
  characters: Character[];
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function CharacterSelector({ characters, disabled, value = [], onChange }: CharacterSelectorProps) {
  return (
    <table className="mt-4 border-spacing-y-2 border-separate w-full">
      <tbody>
        {characters.map(c => {
          const name = c.key;
          const _value = value.filter(v => v === name);
          const handleChange = (changes: string[]) => onChange?.([...value.filter(v => v !== name), ...changes]);
          return (
            <tr key={c.key}>
              <td className="whitespace-nowrap pr-2">
                <Label htmlFor={name}>{c.name}</Label>
              </td>
              <td>
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleChange(_value.slice(1))}
                    disabled={disabled || _value.length === 0}
                  >
                    -
                  </Button>
                  <Input className="text-center" type="number" name={name} value={_value.length} readOnly />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleChange([..._value, name])}
                    disabled={disabled}
                  >
                    +
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
