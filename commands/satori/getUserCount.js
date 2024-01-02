const { SlashCommandBuilder } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getusercount')
		.setDescription('Gets the number of users from firebase auth'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return await interaction.editReply('You do not have permission to use this command.');
		}

		const users = await listAllUsers();

		await interaction.editReply({
			embeds: [{
				title: 'User Count',
				description: users.length,
			}],
		});
		// await interaction.editReply('Done!');
	},
};

async function listAllUsers(nextPageToken) {
	// List batch of users, 1000 at a time.
	const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
	const users = listUsersResult.users;
	if (listUsersResult.pageToken) {
		// List next batch of users.
		return listAllUsers(listUsersResult.pageToken);
	}
	return users;
}
