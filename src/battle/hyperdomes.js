import { cloneDeep  } from "lodash";
import { generateBattleReport } from '../battle/battle';

function customShuffle(array) {
  const random = window.R.MersenneTwister19937.autoSeed();

  return window.R.shuffle(random, array);
}

const getMinutes = (minutes) => {
  return 1000 * 60 * minutes
}

export function getData(data) {
  return {
    time: getMinutes(0),
    timeBetweenBattles: getMinutes(data.timeBetweenBattles),
    totalTime: getMinutes(data.totalTime * 60),
    missBattles: data.missBattles,
    battleflies: data.battleflies,
    stats: {
      battlesCount: 0,
      battleflies: {},
      battles: []
    }
  }
}

function selectBattleflies(battleflies) {
  const shuffled = customShuffle(battleflies).filter(item => item.cannotSelectDuring === 0);
  const items = shuffled.slice(0, 2);

  if(items.length !== 2) {
    return shuffled.concat(customShuffle(battleflies.filter(i => !shuffled.includes(i)))).slice(0, 2);
  }

  return items;
}

function startBattle(bA, bB) {
  return generateBattleReport(bA, bB);
}

export async function startHyperdome(data) {
  data.battleflies.forEach(item => {
    item.cannotSelectDuring = 0;
  })
  let id = 1;

  while (data.time < data.totalTime) {
    const [battleflyA, battleflyB] = selectBattleflies(data.battleflies);

    // console.log(id);

    if(!data.stats.battleflies[battleflyA.id]) {
      data.stats.battleflies[battleflyA.id] = {
        wins: 0,
        loses: 0,
        hp: [],
        duration: []
      }
    }

    if(!data.stats.battleflies[battleflyB.id]) {
      data.stats.battleflies[battleflyB.id] = {
        wins: 0,
        loses: 0,
        hp: [],
        duration: []
      }
    }

    const cloneA = cloneDeep(battleflyA);
    const cloneB = cloneDeep(battleflyB);

    const battle = await startBattle(cloneA, cloneB);
    const results = battle[3];

    const [winner, loser] = results.winner === battle[0] ? [battle[0], battle[1]] : [battle[1], battle[0]];

    data.stats.battleflies[winner.getId()].wins++;
    data.stats.battleflies[loser.getId()].loses++;

    data.stats.battleflies[winner.getId()].hp.push(winner.currentStats.hp);
    data.stats.battleflies[loser.getId()].hp.push(loser.currentStats.hp);

    data.stats.battleflies[winner.getId()].duration.push(results.duration);
    data.stats.battleflies[loser.getId()].duration.push(results.duration);

    data.stats.battlesCount++;

    data.stats.battles.push({
      id: id,
      battleflyA: battle[0].getId(),
      battleflyB: battle[1].getId(),
      battleflyALeftHP: battle[0].currentStats.hp,
      battleflyBLeftHP: battle[1].currentStats.hp,
      time: data.time,
      winner: winner.getId(),
      duration: results.duration
    });

    data.battleflies.forEach(item => {
      item.cannotSelectDuring = Math.max(0, item.cannotSelectDuring - 1);
    });

    battleflyA.cannotSelectDuring = data.missBattles;
    battleflyB.cannotSelectDuring = data.missBattles;

    data.time += Math.max(data.timeBetweenBattles, results.duration);

    id++;
  }

  return data;
}
