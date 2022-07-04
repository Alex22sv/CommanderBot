const {embedColor, errorColor, loadingEmoji, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(commandDescriptions.start)
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
            await server.start();
            const startingServerEmbed = new MessageEmbed()
                .setDescription(`${loadingEmoji} Starting server **${server.name}**.`)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
             return interaction.reply({ embeds:[startingServerEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'start' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Server is not offline"){
                const serverNotOfflineEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('This is only possible when your server is offline.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[serverNotOfflineEmbed], ephemeral:true});
                
            } 
            if(e.message == "Cannot read properties of undefined (reading 'start')"){
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