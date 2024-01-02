const { SlashCommandBuilder } = require('discord.js');
const FireBase = require('firebase-admin/firestore');
const db = new FireBase.Firestore();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delinvite')
		.setDescription('Deletes an invite code')
		.addStringOption(option => option.setName('code').setDescription('Invite code text').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return await interaction.editReply('You do not have permission to use this command.');
		}

		const code = interaction.options.getString('code');

		const inviteRef = db.collection('inviteCodes').doc(code);

		if (!(await inviteRef.get()).exists) {
			return await interaction.editReply('That invite code does not exist.');
		}

		await inviteRef.delete();

		await interaction.editReply({
			embeds: [{
				title: 'Invite Invalidated',
				description: `Invite code: ${code}`,
			}],
		});
	},
};