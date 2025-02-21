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
					{name: "Banned in all maps", value: "shared"},
					{name: "Castle Grounds", value: "cg"},
					{name: "Castle Main Floor", value: "cmf"},
					{name: "Castle Upper Floor", value: "cuf"},
					{name: "Jolly Roger Bay", value: "jrb"},
					{name: "Big Boo's Haunt", value: "bbh"},
					{name: "Lethal Lava Land", value: "lll"},
					{name: "Hazy Maze Cave", value: "hmc"},
					{name: "Tall Tall Mountain", value: "ttm"},
					{name: "Tiny-Huge Island", value: "thi"},
					{name: "Rainbow Ride", value: "rr"},
					{name: "Princess's Secret Slide", value: "pss"},
					{name: "Wing Mario Over the Rainbow", value: "wmotr"},
				)),
		async execute(interaction) {

			const next = new ButtonBuilder()
				.setCustomId('next')
				.setLabel('Next spot')
				.setStyle(ButtonStyle.Secondary)
	
			const back = new ButtonBuilder()
				.setCustomId('back')
				.setLabel('Previous spot')
				.setStyle(ButtonStyle.Secondary);

			const pages = {
				"shared": {
					"stage": "All stages",
					"spots": [
						{
							"images": [],
							"text": "Hiding inside a cannon (by setting spot while over a cannon)"
						},
						{
							"images": [],
							"text": "Hiding in any wind in stages such as TTM or THI"
						}
					]
				},
				"cg": {
					"stage": "Castle Grounds",
					"spots": [
						{
							"images": [
								"Screenshot (272)",
								"Screenshot (273)"
							],
							"text": "Hiding inside either of the 2 pillars on top of the castle"
						},
						{
							"images": [
								"Screenshot (274)",
							],
							"text": "Hiding out-of-bounds behind the castle doors"
						},
						{
							"images": [
								"Screenshot (300)"
							],
							"text": "Holding onto the bottom of the Wooden bridge"
						}
					]
				},
				"cmf": {
					"stage": "Castle Main Floor",
					"spots": [
						{
							"images": [
								"Screenshot (275)"
							],
							"text": "Hiding out-of-bounds behind the entrance doors to the castle"
						},
						{
							"images": [
								"Screenshot (276)",
								"Screenshot (277)"
							],
							"text": "Hiding inside either of the pillars next to the main stairs"
						}
					]
				},
				"jrb": {
					"stage": "Jolly Roger Bay",
					"spots": [
						{
							"images": [
								"Screenshot (278)"
							],
							"text": "Hiding out-of-bounds above the outcove behind the rock"
						}
					]
				},
				"pss": {
					"stage": "Princess's Secret Slide",
					"spots": [
						{
							"images": [
								"Screenshot (279)"
							],
							"text": "Hiding on top of the first pillar near the bottom of the slide (other pillars are fine)"
						},
						{
							"images": [
								"Screenshot (281)"
							],
							"text": "Hiding on top of the roof of the exit room"
						}
					]
				},
				"bbh": {
					"stage": "Big Boo's Haunt",
					"spots": [
						{
							"images": [
								"Screenshot (282)"
							],
							"text": "Hiding behind the bookshelf next to \"Secret of the haunted books\" power star"
						}
					]
				},
				"lll": {
					"stage": "Lethal Lava Land",
					"spots": [
						{
							"images": [
								"Screenshot (283)"
							],
							"text": "Hiding on top of the grate next to the \"Red-hot log rolling\" power star"
						},
						{
							"images": [
								"Screenshot (284)"
							],
							"text": "Hiding inside the fire spinner in the back-left of the stage"
						}
					],
				},
				"hmc": {
					"stage": "Hazy Maze Cave",
					"spots": [
						{
							"images": [
								"Screenshot (298)"
							],
							"text": "Holding onto the grates over the hole next to the \"A-maze-ing emergency exit\" power star"
						}
					]
				},
				"ttm": {
					"stage": "Tall Tall Mountain",
					"spots": [
						{
							"images": [
								"Screenshot (285)"
							],
							"text": "Hiding out-of-bounds behind the waterfall at the start of the stage"
						},
						{
							"images": [
								"Screenshot (294)"
							],
							"text": "Hiding out-of-bounds below the monkey platform by using the slope clip"
						},
						{
							"images": [
								"Screenshot (299)"
							],
							"text": "Grabbing onto the edge of the slide at the dead-end spot"
						}
					]
				},
				"thi": {
					"stage": "Tiny-Huge Island",
					"spots": [
						{
							"images": [
								"Screenshot (296)"
							],
							"text": "Holding onto the bottom of Wiggler's cage"
						}
					]
				},
				"cuf": {
					"stage": "Castle Upper Floor",
					"spots": [
						{
							"images": [
								"Screenshot (288)"
							],
							"text": "Hiding out-of-bounds behind the entrance to Tick-Tock Clock"
						}
					]
				},
				"rr": {
					"stage": "Rainbow Ride",
					"spots": [
						{
							"images": [
								"Screenshot (289)"
							],
							"text": "Hiding on top of the castle (inside is allowed)"
						},
						{
							"images": [
								"Screenshot (291)"
							],
							"text": "Hiding on the ship"
						}
					]
				},
				"wmotr": {
					"stage": "Wing Mario over the Rainbow",
					"spots": [
						{
							"images": [
								"Screenshot (290)"
							],
							"text": "The entirety of Wing Mario over the Rainbow is banned. Attempting to enter it will kick you back to the castle"
						}
					]
				}
			};

			var spotData = pages[interaction.options.getString('stage')]

			async function getPage(page, response) {
				
				const collectorFilter = i => i.user.id === interaction.user.id;
				try {
					const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
				
					if (confirmation.customId === 'next') {
						back.setDisabled(page+1==0);
						next.setDisabled(page+1==spotData.spots.length-1);

						const embeds = []
						for (var image of spotData.spots[page+1].images) {
							image=image.replaceAll(" ", "%20");
							console.log(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`);
							embeds.push(new EmbedBuilder().setImage(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`))
						}
						if (embeds.length == 0) embeds.push(new EmbedBuilder());
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
		
						getPage(page+1, response)
					} else if (confirmation.customId === 'back') {
						back.setDisabled(page-1==0);
						next.setDisabled(page-1==spotData.spots.length-1);
						
						const embeds = []
						for (var image of spotData.spots[page-1].images) {
							image=image.replaceAll(" ", "%20");
							console.log(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`);
							embeds.push(new EmbedBuilder().setImage(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`))
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

						getPage(page-1, response)
					}
				} catch {}
			}
			if (spotData) {
				back.setDisabled(true)
				next.setDisabled(spotData.spots.length < 2)
				const embeds = []
				for (var image of spotData.spots[0].images) {
					image=image.replaceAll(" ", "%20");
					console.log(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`);
					embeds.push(new EmbedBuilder().setImage(`https://gingerphoenix10.com/TourneyBot/images/${interaction.options.getString('stage')}/${image}.png`))
				}
				if (embeds.length == 0) embeds.push(new EmbedBuilder());
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
				getPage(0, response);
			} else {
				const response = await interaction.reply({
					embeds: [new EmbedBuilder().setTitle(interaction.options.getString('stage'))
						.setColor(0x7289DA)
						.setDescription("There are no banned spots for this stage.")]
				});
			}
		},

};