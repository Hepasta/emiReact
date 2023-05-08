
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const Guilds = client.guilds.cache.map(guild => guild.id)
		console.table(Guilds)

	},
};