const { Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getreact } = require('../utils/database.js')

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(client, interaction, user) {
		if(user.bot == true){ return 0 }
        console.log(`@${user.username} a ajouté ${interaction.emoji}`);
		console.log(`messageID : ${interaction.message.id}\n`)

		getreact(interaction.message.id, interaction.emoji, interaction.message.guild.id).then( result => {
			if(result != false){ 
				if(result[1] == 'normal'){
					roletab = interaction.message.guild.roles.cache.find(r => r.id == result[0])
					usertab = interaction.message.guild.members.cache.find(m => m.id == user.id)
					usertab.roles.add(roletab)
				}
				if(result[1] == 'quote'){

					embfield = ''
					interaction.message.channel.messages.fetch(interaction.message.id).then(msg => {

						embtitle = msg.embeds[0].title
						embdesc = msg.embeds[0].description
						try{ embfield = msg.embeds[0].fields}
						catch{ embfield = undefined}

						if(embfield != undefined){

							fullresult = 0
							emojiList = []
							for(i=0; i<embfield.length; i++){
								getEmoji = embfield[i].value.split(' : ')
								getEmoji = getEmoji[0].replace('> ', '')
								
								if(getEmoji.includes('<:') == true){
									getEmoji = getEmoji.replace('>', '')
									getEmoji = getEmoji.split(':')
									getEmoji = getEmoji[2] 
								}
								emojiList.push([msg.reactions.cache.get(getEmoji).count - 1]) // crash aucune lecture de count
								fullresult = fullresult + msg.reactions.cache.get(getEmoji).count - 1
							}
							updateEmbeds(client, interaction.message, msg,embtitle, embdesc, embfield, emojiList, fullresult)
						}
					})
				}
			}
		})
	},
};

function updateEmbeds(client, message, msg, embtitle, embdesc, embfield, emojiList, fullresult){

	for(i=0; i<embfield.length; i++){
		pourcent = emojiList[i] * 100 / fullresult
		pourcent = Math.round(pourcent)
		if(pourcent == NaN){ pourcent = 0}
		embfield[i].value = embfield[i].value.split('・')
		embfield[i].value = embfield[i].value[0] + '・' + pourcent + '%'
	}

	const Embed = new EmbedBuilder()
	.setColor(0x68dbff)
	.setTitle(embtitle)
	.setDescription(embdesc)
	.setTimestamp()
	.addFields(embfield);
	msg.edit({ embeds: [Embed] });
}