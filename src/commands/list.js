const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription(commandDescriptions.list)
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('list')
                .setDescription('Send the name of the list here.')
                .setRequired(true)
                .setChoices(
                    {name:'online players', value:'online-players'},
                    {name:'whitelist', value:'whitelist'},
                    {name:'ops', value:'ops'},
                    {name:'banned players', value:'banned-players'},
                    {name:'banned IPs', value:'banned-ips'}
                )),
    async run(bot, interaction) {
        try{ 
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            let list = interaction.options.getString('list');
            if(list === 'online-players'){
                if(server.players.count == 0){
                    const noOnlinePlayersEmbed = new MessageEmbed() 
                        .setDescription(`There are no online players on server **${server.name}**.`)
                        .setColor(embedColor)
                        .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({embeds:[noOnlinePlayersEmbed], ephemeral:false});
                } else{ 
                    const onlinePlayersEmbed = new MessageEmbed()             
                        .setDescription(`Online players on server **${server.name}**: \n${server.players.list.slice(0).join(', ')}`)
                        .setColor(embedColor)
                        .setTimestamp()
                        .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({embeds:[onlinePlayersEmbed], ephemeral:false});
                }
            } else {
                let listContent = server.getPlayerList(list);
                let listEntries = await listContent.getEntries();
                if(listEntries == '') {
                    const noContentEmbed = new MessageEmbed()
                        .setDescription(`There's no content in the list **${list}** of the server **${server.name}**.`)
                        .setColor(embedColor)
                        .setTimestamp()
                        .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({embeds:[noContentEmbed], ephemeral:false});
                }
                const listContentEmbed = new MessageEmbed()
                    .setDescription(`The content of **${list}** of the server **${server.name}**: \n${listEntries.slice(0).join(', ')}`)
                    .setColor(embedColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[listContentEmbed], ephemeral:false});
            }
        } catch(e) {
            console.error(`An error ocurred while running the command 'list' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Cannot read properties of undefined (reading 'getPlayerList')" || e.message == "Cannot read properties of undefined (reading 'players')"){
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