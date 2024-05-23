import {
	getPlayer,
	getPlayerRecord,
	getPlayerStats,
	getPlayerExtendedStats
} from "./services/request.js";
/**
 * Test
 */

const playerList = await getPlayer("東光大麥", 3);
const user = playerList[0];
const recordList = await getPlayerRecord(user.id, 3);
const paipuUID = recordList[0].uuid;
console.log(`牌譜：https://game.maj-soul.net/1/?paipu=${paipuUID}`);
const playerStats = await getPlayerStats(user.id, 3);
console.log(playerStats);
const playerExtendedStats = await getPlayerExtendedStats(user.id, 3);
console.log(playerExtendedStats);
