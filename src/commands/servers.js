const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription(commandDescriptions.servers),
    async run(bot, interaction) {
        try{ 
            let account = await exarotonClient.getAccount();
            let servers = await exarotonClient.getServers();
            let string = '';
            if(servers.length == 0) {
                const noServerFound = new MessageEmbed()
                    .setDescription(`The exaroton account **${account.name}** has no servers.`)
                    .setColor(embedColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[noServerFound], ephemeral:false});
            } else{
                    for(let server of servers){
                        string += 'Server address: `' + server.address + '`| Server ID: `' + server.id + '` \n';
                    }
                    const listServersEmbed = new MessageEmbed()
                        .setTitle(`${account.name}'s servers`)
                        .setDescription(string)
                        .setColor(embedColor)
                        .setTimestamp()
                        .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({ embeds:[listServersEmbed], ephemeral:false});
            }
        } catch(e) {
            console.error(`An error ocurred while running the command 'servers' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
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