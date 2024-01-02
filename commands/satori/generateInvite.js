const { SlashCommandBuilder } = require('discord.js');
const FireBase = require('firebase-admin/firestore');
const db = new FireBase.Firestore();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('generateinvite')
		.setDescription('Generates an invite for a user')
		.addStringOption(option => option.setName('code').setDescription('Invite code text').setRequired(false))
		.addIntegerOption(option => option.setName('maxuse').setDescription('Max number of uses').setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return await interaction.editReply('You do not have permission to use this command.');
		}

		let code = null;

		if (interaction.options.getUser('code') !== null) {
			code = interaction.options.getUser('code');
		}
		else {
			code = randAlphaNum(6);
		}

		let maxUse = null;

		if (interaction.options.getInteger('maxuse')) {
			maxUse = interaction.options.getInteger('maxuse');
		}
		else {
			maxUse = 1;
		}

		const inviteRef = db.collection('inviteCodes').doc(code);

		if ((await inviteRef.get()).exists) {
			return await interaction.editReply('That invite code already exists.');
		}

		const invite = {
			code: code,
			created: Date.now(),
			createdBy: interaction.user.id,
			maxUses: maxUse,
			uses: 0,
		};

		await inviteRef.set(invite);

		await interaction.editReply({
			embeds: [{
				title: 'Invite Created',
				description: `Invite code: ${code}\nMax uses: ${maxUse}`,
			}],
		});
	},
};

function randAlphaNum(len) {
	let rdmString = '';
	for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
	return rdmString.substr(0, len);
}

