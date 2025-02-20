const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banned')
		.setDescription('Show banned spots in each stage for the Geoguessr Tournament')
		.addStringOption(option =>
			option.setName('stage')
				.setDescription('The stage to check spots of')
				.setRequired(true)
				.addChoices(
					{name: "Castle Grounds", value: "cg"}
				)),
		async execute(interaction) {

			const next = new ButtonBuilder()
				.setCustomId('next')
				.setLabel('Next stage')
				.setStyle(ButtonStyle.Secondary)
	
			const back = new ButtonBuilder()
				.setCustomId('back')
				.setLabel('Previous stage')
				.setStyle(ButtonStyle.Secondary);

			const pages = {
				"cg": {
					"stage": "Castle Grounds",
					"spots": [
						{
							"images": [
								"https://gingerphoenix10.com/geobot/cg/a.png",
								"https://gingerphoenix10.com/geobot/cg/b.png"
							],
							"text": "Hiding inside either of the 2 pillars on top of the castle"
						},
						{
							"images": [
								"https://gingerphoenix10.com/Mania/placehodler.png",
							],
							"text": "text2"
						}
					]
				},
				"ci": {
					"stage": "Castle inside or sum shit idk im speedrunning this"
				}
			};

			var spotData = pages[interaction.options.getString('stage')]

			back.setDisabled(true)
			next.setDisabled(spotData.spots.length < 2)

			const embeds = []
			for (var image of spotData.spots[0].images) {
				embeds.push(new EmbedBuilder().setImage(image))
			}
			embeds[0].setTitle(spotData.stage)
				.setColor(0x7289DA)
				.setDescription(spotData.spots[0].text)

			const response = await interaction.reply({
				embeds: embeds,
				components: [
					new ActionRowBuilder()
						.addComponents(back, next)
				],
				withResponse: true,
			});

			async function getPage(page) {
				
				const collectorFilter = i => i.user.id === interaction.user.id;
				try {
					const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
				
					if (confirmation.customId === 'next') {
						back.setDisabled(page+1==0);
						next.setDisabled(page+1==spotData.spots.length-1);

						const embeds = []
						for (var image of spotData.spots[page+1].images) {
							embeds.push(new EmbedBuilder().setImage(image))
						}
						embeds[0].setTitle(spotData.stage)
							.setColor(0x7289DA)
							.setDescription(spotData.spots[page+1].text)

						confirmation.update({
							embeds: embeds,
							components: [
								new ActionRowBuilder()
									.addComponents(back, next)
							],
							withResponse: true,
						})
		
						getPage(page+1)
					} else if (confirmation.customId === 'back') {
						back.setDisabled(page-1==0);
						next.setDisabled(page-1==spotData.spots.length-1);
						
						const embeds = []
						for (var image of spotData.spots[page-1].images) {
							embeds.push(new EmbedBuilder().setImage(image))
						}
						embeds[0].setTitle(spotData.stage)
							.setColor(0x7289DA)
							.setDescription(spotData.spots[page-1].text)

						confirmation.update({
							embeds: embeds,
							components: [
								new ActionRowBuilder()
									.addComponents(back, next)
							],
							withResponse: true,
						})

						getPage(page-1)
					}
				} catch(e) {
					console.log(e);
					await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
				}
			}
			getPage(0);
		},

};