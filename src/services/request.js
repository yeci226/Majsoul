import axios from "axios";
// import { client } from "../index.js";
// const db = client.db;

const match_level = {
	4: {
		金東: 8,
		金: "8.9",
		金南: "9",
		玉東: 11,
		玉: "11.12",
		玉南: "12",
		王座東: 15,
		王座南: 16,
		王座: "15.16",
		王: "15.16",
		all: "8.9.11.12.15.16"
	},
	3: {
		金東: 21,
		金南: "22",
		金: "21.22",
		玉東: 23,
		玉: "23.24",
		玉南: 24,
		王座東: 25,
		王座南: 26,
		王座: "25.26",
		王: "25.26",
		all: "21.22.23.24.25.26"
	}
};

const modeID = {
	3: "21.22.23.24.25.26",
	4: "8.9.11.12.15.16"
};

/**
 *
 * @param {*} playerName  玩家名稱
 * @param {*} mode 3人 / 4人
 * @returns
 */
const fourBaseURL = "https://ak-data-1.sapk.ch/api/v2/pl4/search_player/";
const threeBaseURL = "https://ak-data-1.sapk.ch/api/v2/pl3/search_player/";
async function getPlayer(playerName, mode = 4) {
	const url = mode == 4 ? fourBaseURL : threeBaseURL;
	const res = await axios.get(url + encodeURIComponent(playerName));
	return res.data;
}

/**
 *
 * @param {*} playerid 玩家ID
 * @param {*} mode 3人 / 4人
 * @param {*} endTime 結束時間
 * @param {*} startTime 開始時間
 * @param {*} total 最多數量
 * @returns
 */
async function getPlayerRecord(
	playerid,
	mode = 4,
	endTime = null,
	startTime = 1262304000000,
	total = 1999
) {
	endTime = endTime || Math.floor(new Date().getTime() / 1000);
	const url = `https://1.data.amae-koromo.com/api/v2/pl${mode}/player_records/${playerid}/${endTime}/${startTime}?limit=${total}&mode=${modeID[mode]}&descending=true`;
	const res = await axios.get(url);
	return res.data;
}

async function getPlayerStats(playerid, searchtype) {
	const nowTime = Math.floor(new Date().getTime() / 10) * 10000 + 9999;
	const url = `https://1.data.amae-koromo.com/api/v2/pl${searchtype}/player_stats/${playerid}/1262304000000/${nowTime}?mode=${modeID[searchtype]}`;
	const res = await axios.get(url);
	return res.data;
}

/**
 *
 * @param {*} playerid 玩家ID
 * @param {*} searchtype 3人 / 4人
 * @param {*} end_time 結束時間
 * @param {*} start_time 開始時間
 * @param {*} mode 場況字符串
 */
async function getPlayerExtendedStats(
	playerid,
	searchtype,
	end_time = null,
	start_time = null,
	mode = null
) {
	if (!end_time || !start_time) {
		end_time = Math.floor(new Date().getTime() / 10) * 10000 + 9999;
		start_time = 1262304000000;
	}

	if (mode) {
		mode = match_level[mode][searchtype];
	} else {
		mode = searchtype === 4 ? "8.9.11.12.15.16" : "21.22.23.24.25.26";
	}

	const url = `https://1.data.amae-koromo.com/api/v2/pl${searchtype}/player_extended_stats/${playerid}/${start_time}/${end_time}?mode=${mode}`;
	const res = await axios.get(url);
	return res.data;
}

export { getPlayer, getPlayerRecord, getPlayerExtendedStats };

const playerList = await getPlayer("東光大麥", 3);
const user = playerList[0];
const recordList = await getPlayerRecord(user.id, 3);
const paipuUID = recordList[0].uuid;
console.log(`牌譜：https://game.maj-soul.net/1/?paipu=${paipuUID}`);
const playerStats = await getPlayerStats(user.id, 3);
console.log(playerStats);
const playerExtendedStats = await getPlayerExtendedStats(user.id, 3);
console.log(playerExtendedStats);
