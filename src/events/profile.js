import { client } from "../index.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Events, EmbedBuilder, WebhookClient, ChannelType } from "discord.js";
import { Logger } from "../services/logger.js";
import { getPlayerStats } from "../services/request.js";

const emoji = client.emoji;
const db = client.db;
const webhook = new WebhookClient({ url: process.env.CMDWEBHOOK });

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;
	interaction.deferUpdate().catch(() => {});
	const { customId } = interaction;

	if (customId == "playerListMenu") {
		const [prefix, mode, playerId] = interaction.values[0].split("-");
		const playerStats = await getPlayerStats(playerId, mode);

		interaction.message.edit({
			embeds: [
				new EmbedBuilder()
					.setTitle(`${playerStats.nickname} 的簡略資料`)
					.addFields(
						{
							name: `總場數 ${playerStats.count}`,
							value: "\u200b",
							inline: false
						},
						{
							name: `段位達到過最高分數 ${playerStats.max_level.score}`,
							value: "\u200b",
							inline: true
						},
						{
							name: `上一場段位結果 ${playerStats.level.score} \`${playerStats.level.delta}\``,
							value: "\u200b",
							inline: true
						},
						{
							name: `平均順位 ${playerStats.avg_rank.toFixed(2)}`,
							value: "\u200b",
							inline: false
						},
						{
							name: `一位率 ${(playerStats.rank_rates[0] * 100).toFixed(2)}`,
							value: "\u200b",
							inline: true
						},
						{
							name: `二位率 ${(playerStats.rank_rates[1] * 100).toFixed(2)}`,
							value: "\u200b",
							inline: true
						},
						{
							name: `三位率 ${(playerStats.rank_rates[2] * 100).toFixed(2)}`,
							value: "\u200b",
							inline: true
						}
					)
					.setFooter({ text: "從金之間以後開始記錄" })
			]
		});
	}
});
