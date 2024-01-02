const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a list of commands.'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const commands = interaction.client.commands;
		const commandList = commands.map(command => {
			return {
				name: command.data.name,
				value: command.data.description,

			};
		});

		await interaction.editReply({
			embeds: [{
				title: 'Commands',
				description: 'Here is a list of commands.',
				fields: commandList,
			}],
		});
	},
};