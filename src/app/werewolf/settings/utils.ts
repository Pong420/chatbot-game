import { type CharacterKey } from '@werewolf/character';
import { t } from '@werewolf/locales';

export interface CharacterProps {
  good: boolean;
}

export interface Character {
  key: string;
  name: string;
  props: CharacterProps;
}

export const charactersMap: Record<CharacterKey, CharacterProps> = {
  Werewolf: { good: false },
  Villager: { good: true },
  Witcher: { good: true },
  Guard: { good: true },
  Hunter: { good: true },
  Predictor: { good: true }
};

export const characters = Object.entries(charactersMap).map(([key, props]) => {
  return {
    key,
    props,
    name: t(key as CharacterKey)
  };
});
