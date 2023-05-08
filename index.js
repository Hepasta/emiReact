//init discordjs
const fs = require('node:fs');
const { Client, Events, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');

//création du client
const client = new Client({ 
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers ,GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences], 
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
client.commands = new Collection();

//variables des fichiers de commandes / evenements
const eventFiles = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));

//lectures des commandes globales
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//lecture des événements
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}
client.login(token);
