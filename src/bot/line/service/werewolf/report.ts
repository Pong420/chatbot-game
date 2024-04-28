import {
  messageAction,
  centeredText,
  createTableMessage,
  Payload,
  wrapAndCenterText,
  wrapedText,
  primaryButton
} from '@line/utils/createMessage';
import { Character, Villager, Guard, Hunter, Predictor, Werewolf, Witcher } from '@werewolf/character';
import { Poisoned, Voting } from '@werewolf/death';
import { Werewolf as Game } from '@werewolf/game';
import { t } from '@werewolf/locales';

function stringifyCharacters(characters: Character[], showCharacterName = false) {
  const result: string[] = [];
  for (const c of characters) {
    let str = ``;
    if (showCharacterName) str += `【${c.name}】`;
    str += `${c.nickname}`;
    result.push(str);
  }
  return result.join('，');
}

const isKillByVoting = (character: Character) => character.causeOfDeath.some(c => c instanceof Voting);

export function getDetailReport(character: Character, game: Game) {
  const getPlayer = (id: string) => game.getPlayer(id);
  const mapPlayers = (ids: string[]) => ids.map(getPlayer);

  let desc = ``;

  if (character instanceof Villager) {
    if (character.votes.length) {
      const targets = mapPlayers(character.votes).filter(isKillByVoting);
      desc += `成功票殺${stringifyCharacters(targets, true)}`;
    } else {
      desc += `未能成功票殺任何人`;
    }
  }

  if (character instanceof Werewolf) {
    if (character.isKilledBy(character)) {
      desc += `感到厭世，選擇自殺，大家謹記自殺解決不了問題`;
    } else if (character.killed.length) {
      const killed = mapPlayers(character.killed).filter(c => c.isDead);
      const failed = mapPlayers(character.killed).filter(c => !c.isDead);
      desc += `成功殺死 ${stringifyCharacters(killed, true)}`;
      if (failed.length) {
        desc += `，嘗試殺死 ${stringifyCharacters(killed, true)} 失敗`;
      }
    } else {
      desc += `沒有殺害任何人，這是【披著狼皮的羊】?`;
    }
  }

  if (character instanceof Witcher) {
    if (character.rescued) {
      desc += `救了${stringifyCharacters(mapPlayers([character.rescued]), true)}`;
    } else {
      desc += `沒有救任何人`;
    }

    desc += '，';

    if (character.poisoned) {
      desc += `毒死了${stringifyCharacters(mapPlayers([character.poisoned]), true)}`;
    } else {
      desc += `沒有使用毒藥`;
    }
  }

  if (character instanceof Predictor) {
    if (character.predicted.length) {
      if (character.predicted.length === game.players.size) {
        desc += `查看了所有人的身份`;
      } else {
        const characterStr = stringifyCharacters(
          mapPlayers(character.predicted).filter((s): s is Character => !!s),
          true
        );

        desc += `查看了${characterStr}的身份`;
      }
    } else {
      desc += `還未開始偷窺，遊戲就結束了，只有三種可能性，遊戲被終止，被主持跳過了，出現BUG`;
    }
  }

  if (character instanceof Guard) {
    if (!character.protectedSomeone) {
      desc += '沒有守護任何人或自己';
    } else {
      if (!character.selfProtected) {
        desc += '這是一個無私的守衛，沒有選擇守護自己，';
      }

      if (character.protected.length) {
        const selfKey = '自己';
        const count = mapPlayers(character.protected).reduce(
          (result, c) => {
            const name = c.id === character.id ? selfKey : `${c.nickname}`;
            return { ...result, [name]: (result[name] || 0) + 1 };
          },
          { [selfKey]: 0 } as Record<string, number>
        );

        const entries = Object.entries(count)
          .filter(([, count]) => count > 0)
          .map(([name, count]) => `【${name}】${count}次`);

        desc += `成功守護了${entries.join('，')}`;
      } else {
        desc += `未成功守護任何人`;
      }
    }
  }

  if (character instanceof Hunter) {
    if (character.isDead) {
      if (character.causeOfDeath.find(cd => cd instanceof Poisoned)) {
        desc += '被毒死了，無法開槍';
      } else if (character.shot) {
        const target = game.getPlayer(character.shot);
        // const { target } = character;
        desc += `開槍帶走了${stringifyCharacters([target], true)}，`;
        desc += target instanceof Werewolf ? '究竟是亂開，還是真準？' : '是私怨？還是【暴民】基因作祟?';
      } else {
        desc += `沒有選擇開槍，這是個冷靜的獵人`;
      }
    } else {
      desc += `沒有機會開槍`;
    }
  }

  return createTableMessage({
    fillCol: 0,
    title: [centeredText(`狼人殺`), wrapAndCenterText(`${stringifyCharacters([character], true)}的報告`)],
    rows: [[wrapedText(desc, { align: 'start' })]]
  });
}

export function getDeathReport(game: Game) {
  let turn = 0;
  return createTableMessage({
    fillCol: 0,
    title: [centeredText(`狼人殺`), centeredText(t('DeathReport'))],
    rows: [...game.players]
      .sort(([, a], [, b]) =>
        a.turn === b.turn ? (a.isDead === b.isDead ? (isKillByVoting(a) ? 1 : -1) : a.isDead ? -1 : 1) : a.turn - b.turn
      )
      .reduce((rows, [, c]) => {
        let text = `${c.nickname} `;
        if (c.isDead) {
          text += `死在`;
          text += c.causeOfDeath
            .map(cause => {
              if (cause instanceof Voting) return `【${cause.percetage}%票】`;
              else if (c.id === cause.userId) return `【自殺】`;
              else return `【${game.getPlayer(cause.userId).nickname}】手上`;
            })
            .join('');
        } else {
          text += '活著';
        }

        if (turn !== c.turn) {
          turn = c.turn;
          rows.push([centeredText(`【第${turn}天】`)]);
        }

        return [
          ...rows,
          [
            wrapedText(`【${c.name}】`, { flex: 0, align: 'start' }),
            wrapedText(text, {
              align: 'start',
              action: messageAction(t.regex(`PlayerReport`, c.nickname))
            })
          ]
        ];
      }, [] as Payload[][]),
    footer: [wrapAndCenterText(`主持人可以點擊玩家名稱，顯示更詳細的描述`)],
    buttons: [primaryButton(messageAction(t(`End`)))]
  });
}
