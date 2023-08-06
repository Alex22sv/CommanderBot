const {embedColor, errorColor, botGitHubURL, botVersionURL, exarotonDocs} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const commandUsages = require('../commandUsages.json')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(commandDescriptions.help)
        .addStringOption(option => 
            option.setName('command')
                .setDescription('The name of the command.')
                .setRequired(false)
                .addChoices(
                    {name:'account', value:'account'},
                    {name:'ban-ip', value:'ban-ip'},
                    {name:'ban', value:'ban'},
                    {name:'botinfo', value:'bot-info'},
                    {name:'change-ram', value:'change-ram'},
                    {name:'check-ram', value:'chec-kram'},
                    {name:'deop', value:'deop'},
                    {name:'dynip', value:'dynip'},
                    {name:'execute', value:'execute'},
                    {name:'file', value:'file'},
                    {name:'help', value:'help'},
                    {name:'list', value:'list'},
                    {name:'log', value:'log'},
                    {name:'motd', value:'motd'},
                    {name:'op', value:'op'},
                    {name:'pardon-ip', value:'pardonip'},
                    {name:'pardon', value:'pardon'},
                    {name:'restart', value:'restart'},
                    {name:'servers', value:'servers'},
                    {name:'start', value:'start'},
                    {name:'status', value:'status'},
                    {name:'stop', value:'stop'},
                    {name:'unwhitelist', value:'unwhitelist'},
                    {name:'whitelist', value:'whitelist'}
                )
        ),
    async run(bot, interaction) {
        try{ 
            if(!interaction.options.getString('command')) {
                const helpEmbed = new MessageEmbed()
                    .setTitle(bot.user.username + ' | Prefix: Slash commands')
                    .setColor(embedColor)
                    .setDescription(Object.keys(commandDescriptions).map(command => '`'+command+'`').join(', '))
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[helpEmbed], ephemeral:false});
            }
            const commandName = interaction.options.getString('command');
            const commandHelpEmbed = new MessageEmbed()
                .setDescription(`**Help for command _${commandName}_**`)
                .setColor(embedColor)
                .addField('Description', commandDescriptions[commandName])
                .addField('Usage', '`'+commandUsages[commandName]+'`')
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({ embeds:[commandHelpEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'help' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            const errorEmbed = new MessageEmbed()
                .setTitle('Error!')
                .setDescription('An error ocurred while running that command: `' + e.message + '`')
                .setColor(errorColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({embeds:[errorEmbed], ephemeral:true});
        }
    }
}