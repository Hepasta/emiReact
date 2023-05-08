const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Permissions, GatewayIntentBits } = require('discord.js')
const { EmbedBuilder } = require('discord.js');
const { add } = require('../utils/database.js')
// [ ADMIN COMMAND ]

module.exports = {

	data: new SlashCommandBuilder()
	.setName('embed')
	.setDescription('créer un embed')
    .addStringOption(option => option.setName('titre').setDescription('titre').setRequired(true))
    .addStringOption(option => option.setName('desc').setDescription('description')),

	async execute(client, interaction) {

        let titre = interaction.options.getString('titre');
        let desc = interaction.options.getString('desc');
        if(desc == null){ desc = ''}

        const Embed = new EmbedBuilder()
        .setColor(0x68dbff)
        .setTitle(`*「 ${titre} 」*`)
        .setDescription(`*${desc}*`)
        .setTimestamp()
    
        interaction.channel.send({ embeds: [Embed] })
        .then(result => { add(result.id, 'type', 'quote', interaction.guild.id) })

        interaction.reply({ content: `sondage créer`, ephemeral: true })
        
	},  
};