const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { add, rem } = require('../utils/database.js')

module.exports = {
	name: 'messageCreate',
	async execute(client, message) {

		//detection de la commande
		let cmds = message.content.split(' ')
		if(message.author.bot == true){ return 0 }
		if(message.type != 19){ return 0 }

		if(cmds[0] == '/react'){ 
			if(cmds.length < 2){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }
	
			//interpretation de la commande react add
			if(cmds[1] == 'add'){
				if(cmds.length != 4){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }
				cmds[3] = cmds[3].replace('<@&', '')
				cmds[3] = cmds[3].replace('>', '')
				let rect = message.guild.roles.cache.find(r => r.id == cmds[3])
				if(rect == undefined){ message.reply('the role does not exist').then( () => {message.delete()}); return 0 }
		
				add(message.reference.messageId, cmds[2], cmds[3], message.guild.id).then( () => {
					target = message.channel.messages.fetch(message.reference.messageId).then( rmes => { 
						rmes.react(cmds[2])
						.catch(error => console.error('Failed to add reactions:\n'));
					})
				})
			}

			//interpretation de la commande react rem
			if(cmds[1] == 'rem'){
				if(cmds.length != 3){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }
				rem(message.reference.messageId, cmds[2], message.guild.id).then( () => {
					target = message.channel.messages.fetch(message.reference.messageId)
				})
			}
			message.delete()
		}

		if(cmds[0] == '/quote'){ 
			if(cmds.length < 2){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }

			//interprètation de la commande quote add
			if(cmds[1] == "add"){ 
				if(cmds.length < 4){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }

				message.channel.messages.fetch(message.reference.messageId).then(msg => {
					if(msg.author.bot != true){ message.reply('message quote invalid'); return 0 }

					label = ''
					for(i=3;i<cmds.length;i++){
						label = label + ' ' + cmds[i]
					}

					embtitle = msg.embeds[0].title
					embdesc = msg.embeds[0].description

					if(embdesc == null){embdesc = ''}
					try{ embfield = msg.embeds[0].fields}
					catch{ embfield = undefined}

					const Embed = new EmbedBuilder()
					.setColor(0x68dbff)
					.setTitle(embtitle)
					.setDescription(embdesc)
					.setTimestamp()
					if(embfield != undefined){Embed.addFields(embfield)}
					Embed.addFields( { name: `** **`, value: `> ${cmds[2]} : ${label}`},);

					try{
						msg.edit({ embeds: [Embed] });
						msg.react(cmds[2])
					}
					catch{ message.reply({content: 'une erreur emoji c\'est produite', ephemeral: true}) }

					add(message.reference.messageId, cmds[2], 'options', message.guild.id);
				})
			}

			//interprètation de la commande quote rem
			if(cmds[1] == "rem"){ 
				if(cmds.length != 3){ message.reply('commande syntax invalid').then( () => {message.delete()}); return 0 }

				message.channel.messages.fetch(message.reference.messageId).then(msg => {
					if(msg.author.bot != true){ message.reply('message quote invalid'); return 0 }

					embtitle = msg.embeds[0].title
					embdesc = msg.embeds[0].description

					if(embdesc == null){embdesc = ''}
					try{ embfield = msg.embeds[0].fields}
					catch{ embfield = undefined}

					console.log(cmds[2])
					for(i=0; i<embfield.length; i++){
						if(embfield[i].value.includes(cmds[2])){
							embfield.splice(i, 1)
						}
					}

					const Embed = new EmbedBuilder()
					.setColor(0x68dbff)
					.setTitle(embtitle)
					.setDescription(embdesc)
					.setTimestamp()
					if(embfield != undefined){Embed.addFields(embfield)}

					msg.edit({ embeds: [Embed] });
					rem(message.reference.messageId, cmds[2], message.guild.id)
				})

			
			}
			message.delete()
		}
	},
};