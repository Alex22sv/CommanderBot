const {embedColor, errorColor, botGitHubURL, botVersionURL, exarotonDocs} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription(commandDescriptions.botinfo),
    async run(bot, interaction) {
        try{ 
            const infoEmbed = new MessageEmbed()
                .setTitle(bot.user.tag)
                .setDescription('CommanderBot is a Discord bot developed with discord.js. This is a new version of [PhoenixAPI](https://github.com/Alex22-SV/PhoenixAPI-Bot/) which now supports slash commands, but it still manages exaroton servers.')
                .setColor(embedColor)
                .setThumbnail(bot.user.displayAvatarURL())
                .addFields(
                    {name:'Owner', value:'[Alex22#7756](https://alex22sv.tk)', inline:true},
                    {name:'Developed since', value: '1/07/2022', inline:true},
                    {name:'Developed with', value:'JavaScript & exaroton API', inline:true},
                    {name:'Current version', value: `[v1.0.1](${botVersionURL})`, inline:true},
                    {name:'Prefix', value:'Slash commands', inline:true},
                    {name:'Links', value: `[GitHub](${botGitHubURL}) | [exaroton API documentation](${exarotonDocs})`, inline:false}
                )
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({ embeds:[infoEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'botinfo' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
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