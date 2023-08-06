const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-motd')
        .setDescription(commandDescriptions['set-motd'])
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('motd')
                .setDescription('To get the MOTD ignore this field. To change the MOTD of the server send the new MOTD here.')
                .setRequired(true)),
    async run(bot, interaction) {
        try{ 
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            let newMotd = interaction.options.getString('motd');
            await server.setMOTD(newMotd);
            const updatedMOTD = new MessageEmbed()
                .setDescription(`**The MOTD for the server _${server.name}_ has changed to:** \n${newMotd}`)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({ embeds:[updatedMOTD], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'set-motd' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Cannot read properties of undefined (reading 'getMOTD')" || e.message == "Cannot read properties of undefined (reading 'setMOTD')"){
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