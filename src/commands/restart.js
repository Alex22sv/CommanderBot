const {embedColor, errorColor, loadingEmoji, exarotonAPIkey, serverManagerRoleId} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription(commandDescriptions.restart)
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        ),
        
    async run(bot, interaction) {
        try{ 
            // if(interaction.member.roles.cache.some(role => role.name === 'Server Manager')){
            //     return console.log("The role was found on the user.");
            // } else {
            //     return console.log("Not found")
            // }
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            const serverWillBeRestartedEmbed = new MessageEmbed()
                .setDescription(`The server **${server.name}** will be restarted in 10 seconds.`)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            interaction.reply({ embeds:[serverWillBeRestartedEmbed], ephemeral:false});
            await server.executeCommand('say [CommanderBot] This server will be restarted in a few seconds.');
            setTimeout(function(){
                server.restart();
                restartingServerEmbed = new MessageEmbed()
                    .setDescription(`${loadingEmoji} Restarting server **${server.name}**`)
                    .setColor(embedColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                interaction.editReply({embeds:[restartingServerEmbed]})
            },10000)
        } catch(e) {
            console.error(`An error ocurred while running the command 'restart' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Server is not online"){
                const serverNotOnlineEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('This is only possible when your server is online.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.editReply({embeds:[serverNotOnlineEmbed]});
                
            } 
            if(e.message == "Cannot read properties of undefined (reading 'executeCommand')"){
                const serverNotFoundEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('That server does not exist.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.editReply({embeds:[serverNotFoundEmbed]});
            } else {
                const errorEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('An error ocurred while running that command: `' + e.message + '`')
                    .setColor(errorColor)   
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.editReply({embeds:[errorEmbed]});
                
            }
        }
    }
}