import { AchievementUpdate } from '@service/game';
import { Character, Guard, Hunter, Predictor, Villager, Witcher, Werewolf } from './character';
import { Game } from './game';
import { Killed, Voting } from './death';

const isKillByVoting = (character: Character) => character.causeOfDeath.some(death => death instanceof Voting);

export function achievementCount(character: Character, game: Game) {
  const achievement: AchievementUpdate = {};

  if (character instanceof Villager) {
    // 我是村民
    achievement['i_am_villager'] = 1;

    const killedByVote = character.votes.filter(userId => isKillByVoting(game.getPlayer(userId)));

    if (killedByVote.length) {
      // 我是暴民
      achievement[`vote_to_kill`] = killedByVote.length;
    }
  }

  if (character instanceof Werewolf) {
    // 我是狼人
    achievement['i_am_werewolf'] = 1;

    if (character.isKilledBy(character)) {
      achievement['suicided'] = 1;
    }

    // 披著狼皮的羊
    if (character.isDead && character.killed.length === 0) {
      achievement['good_werewolf'] = 1;
    }

    // 賭神
    const witchers = game.getPlayersByCharacter(Witcher);
    if (!!witchers.length && witchers.some(witcher => witcher.rescued === character.id)) {
      achievement['god_of_gamblers'] = 1;
    }

    // 惡夢
    if (!character.isDead && character.killed.length >= 2) {
      achievement[`nightmare`] = 1;
    }

    // 叛徒
    const killedWerewolf = character.killed.filter(userId => game.getPlayer(userId).isKilledBy(character));
    if (killedWerewolf.length) {
      achievement[`traitor`] = killedWerewolf.length;
    }

    // 相殺何太急
    // 狼人們互相殺死對方
    if (
      character.isDead &&
      killedWerewolf.length &&
      character.causeOfDeath.some(c => c instanceof Killed && killedWerewolf.includes(c.userId))
    ) {
      achievement[`fratricidal_fighting`] = 1;
    }
  }

  if (character instanceof Guard) {
    // 我是守衛
    achievement['i_am_guard'] = 1;

    if (!character.protected.includes(character.id) && character.turn > 1) {
      // 我是好人
      achievement['selfless'] = 1;
    }

    if (character.protected.length) {
      // 守護者
      achievement['protected'] = character.protected.length;
    }
  }

  if (character instanceof Hunter) {
    // 我是獵人
    achievement['i_am_hunter'] = 1;

    const werewolfs = game.getPlayersByCharacter(Werewolf);
    // 職業獵人
    if (werewolfs.some(c => c.isKilledBy(character))) {
      achievement['nice_shot'] = 1;
    } else if (character.shot) {
      achievement['bad_shot'] = 1;
    }

    if (character._canShoot === false) {
      achievement['no_shot'] = 1;
    }
  }

  if (character instanceof Witcher) {
    // 我是女巫
    achievement['i_am_witcher'] = 1;

    if (character.rescued) {
      // 菩薩
      achievement['bodhisattva'] = 1;
    }

    if (character.poisoned && game.getPlayer(character.poisoned) instanceof Werewolf) {
      // 毒師
      achievement['poison_master'] = 1;
    }
  }

  if (character instanceof Predictor) {
    // 我是預言家
    achievement['i_am_predictor'] = 1;

    if (character.predicted.length) {
      // 偷窺狂
      achievement['voyeur'] = character.predicted.length;
    }
  }

  if (character.isDead && character.turn === 1) {
    // 我想玩遊戲
    achievement['dead_on_the_first_day'] = 1;
  }

  if (game.stage.survivors.length === 1) {
    if (character instanceof Werewolf) {
      // 孤狼
      achievement[`lonely_werewolf`] = 1;
    } else {
      // 最後的倖存者
      achievement[`last_of_survivor`] = 1;
    }
  }

  if (isKillByVoting(character) && character.turn === 1) {
    // 嫌疑犯
    achievement['killed_by_vote'] = 1;
  }

  return achievement as Record<string, number>;
}
