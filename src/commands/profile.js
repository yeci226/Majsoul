import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder
} from "discord.js";
import { getPlayer } from "../services/request.js";

export default {
	data: new SlashCommandBuilder()
		.setName("profile")
		.setNameLocalizations({
			"zh-TW": "個人簡介"
		})
		.setDescription("Only information for Quejie and above can be queried")
		.setDescriptionLocalizations({
			"zh-TW": "只能查詢雀傑及以上的資料"
		})
		.addStringOption(option =>
			option
				.setName("mode")
				.setNameLocalizations({ "zh-TW": "遊戲模式" })
				.setDescription("...")
				.setRequired(true)
				.addChoices(
					{
						name: "3 Players",
						name_localizations: {
							"zh-TW": "3人"
						},
						value: "3"
					},
					{
						name: "4 Players",
						name_localizations: {
							"zh-TW": "4人"
						},
						value: "4"
					}
				)
		)
		.addStringOption(option =>
			option
				.setName("username")
				.setNameLocalizations({ "zh-TW": "玩家名稱" })
				.setDescription("...")
				.setRequired(false)
		)
		.addUserOption(option =>
			option
				.setName("user")
				.setNameLocalizations({
					"zh-TW": "使用者"
				})
				.setDescription("...")
				.setRequired(false)
		),
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	async execute(client, interaction, args, db) {
		const mode = interaction.options.getString("mode");
		const username = interaction.options.getString("username");
		const user = interaction.options.getUser("user");

		if (!username || user)
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							"兔子先生沒有搜尋任何人的話，雛桃是找不到到喔！"
						)
						.setColor("#EE4E4E")
						.setThumbnail(
							"https://mjsinfo.pages.dev/emo/chutao/jp-8.png"
						)
				],
				ephemeral: true
			});

		await interaction.deferReply();
		interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle("兔子先生，雛桃正在努力搜尋中！")
					.setThumbnail(
						"https://mjsinfo.pages.dev/emo/chutao/jp-1.png"
					)
			]
		});

		const playerList = await getPlayer(username, mode);
		if (playerList.length == 0)
			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle(
							`兔子先生，雛桃沒有找到叫做 ${username} 而且在雀傑以上的人！`
						)
						.setColor("#EE4E4E")
						.setThumbnail(
							"https://mjsinfo.pages.dev/emo/chutao/jp-6.png"
						)
				]
			});

		if (playerList.length > 1) {
			playerList.slice(0, 24);
			interaction.editReply({
				embeds: [],
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder()
							.setPlaceholder(
								`兔子先生，雛桃找到了好幾個叫做${username}的人！`
							)
							.setCustomId("playerListMenu")
							.setMinValues(1)
							.setMaxValues(1)
							.addOptions(
								playerList.map((player, i) => ({
									label: `${i + 1}. ${player.nickname}`,
									value: `profile-${mode}-${player.id}`
								}))
							)
					)
				]
			});
		}
	}
};
