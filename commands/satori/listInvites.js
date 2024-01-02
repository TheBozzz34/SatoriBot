const { SlashCommandBuilder } = require('discord.js');
const FireBase = require('firebase-admin/firestore');
const db = new FireBase.Firestore();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listinvites')
		.setDescription('Lists all invite codes'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return await interaction.editReply('You do not have permission to use this command.');
		}

		const inviteRef = db.collection('inviteCodes');

		const invites = await inviteRef.get();

		let inviteList = 'Invite codes:\n';

		invites.forEach(invite => {
			inviteList += `${invite.data().code}\n Uses left: ${invite.data().maxUses - invite.data().uses}\n\n`;
		});

		await interaction.editReply({
			embeds: [{
				title: 'Invite Codes',
				description: inviteList,
			}],
		});
	},
};