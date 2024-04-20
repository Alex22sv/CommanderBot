const Discord = require("discord.js");
const intents = new Discord.Intents();
const bot = new Discord.Client({intents: 8});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { discordToken, clientId } = require('./src/config.json');
const fs = require('fs');

bot.on('ready', () => {
	console.log('The bot has successfully started.');
	bot.user.setPresence({
		activities: [{
			name:"servers",
			type: "WATCHING"
		}],
		status: "dnd"
	})
});

const commands = [];
bot.slashcommands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
	bot.slashcommands.set(command.data.name, command)
}
const rest = new REST({ version: '9' }).setToken(discordToken);
(async () => {
	try {
		console.log('Started to reload slash commands.');
		await rest.put(Routes.applicationCommands(clientId), { body: commands });
		console.log('Slash commands have been successfully reloaded.');
	} catch (error) {
		console.error(error);
	}
})();

bot.on('interactionCreate', async(interaction) => {
	
	// console.log(interaction.guild.roles.cache.filter(role => {console.log(interaction.member.roles.includes('992458634317545484'))}))
	if(!interaction.isCommand()) return;
	const slashcmds = bot.slashcommands.get(interaction.commandName);
	if(!slashcmds) return;
	try {
		await slashcmds.run(bot, interaction);
	} catch(e) {
		console.error(e);
	}
});

bot.login(discordToken);