const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dynip')
        .setDescription(commandDescriptions.dynip)
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
            await server.get();
            if(server.host === null){
                const serverNotOnlineEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('This is only possible when your server is online.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[serverNotOnlineEmbed], ephemeral:true});
            }
            const dynipEmbed = new MessageEmbed()
                .setDescription('DynIP for server **' + server.name + '**: `' + server.host + ':' +server.port + '`')   
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
             return interaction.reply({ embeds:[dynipEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'dynip' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Cannot read properties of undefined (reading 'get')"){
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