const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log')
        .setDescription(commandDescriptions.log)
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        ),
    async run(bot, interaction) {
        try{ 
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            let logs = await server.shareLogs();
            const logEmbed = new MessageEmbed()
                .setDescription(`Server log of **${server.name}**: ${logs}`)   
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({ embeds:[logEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'log' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Log file is empty or does not exist"){
                const emptyLog = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('That server log is empty or does not exist.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[emptyLog], epheral:true})
            }
            if(e.message == "Cannot read properties of undefined (reading 'shareLogs')"){
                const serverNotFoundEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('That server does not exist.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[serverNotFoundEmbed], ephemeral:true});
            } else {
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
}