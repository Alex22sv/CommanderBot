const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription(commandDescriptions.status)
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
            const statusEmbed = generateEmbed(server)
            interaction.reply({ embeds:[statusEmbed], ephemeral:false});
            server.subscribe()
            server.on('status', (server) => {
                interaction.editReply({embeds: [generateEmbed(server)]});
            });
            function generateEmbed(server){
                if (server.hasStatus(server.STATUS.ONLINE)) {
                    currentStatus = 'Online'
                    statusColor = '#19ba19'
                } else if (server.hasStatus(server.STATUS.PREPARING)) {
                    currentStatus = 'Preparing...'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.STARTING)) {
                    currentStatus = 'Starting...'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.LOADING)) {
                    currentStatus = 'Loading...'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.RESTARTING)) {
                    currentStatus = 'Restarting...'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.PENDING)) {
                    currentStatus = 'Pending'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.CRASHED)) {
                    currentStatus = 'Crashed'
                    statusColor = '#f91c1c'
                } else if (server.hasStatus(server.STATUS.STOPPING)){
                    currentStatus = 'Stopping...'
                    statusColor = '#678188'
                } else if (server.hasStatus(server.STATUS.SAVING)) {
                    currentStatus = 'Saving...'
                    statusColor = '#678188'
                } else if(server.hasStatus(server.STATUS.OFFLINE)) {
                    currentStatus = 'Offline'
                    statusColor = '#f91c1c'
                }
                let motd = server.motd;
                motd = motd.replace(/\\u[\da-f]{4}/gi, c => String.fromCodePoint(parseInt(c.substr(2), 16)));
                motd = motd.replace(/\n/g, '').replace('\\n', '\n');
                motd = motd.replace(/§[\da-gk-or]/g, '');
                return new MessageEmbed()
                    .setTitle(server.address)
                    .setDescription(motd)
                    .setColor(statusColor)
                    .addFields(
                        {name:'Current Status', value:currentStatus, inline:true},
                        {name:'Players', value:`${server.players.count}/${server.players.max}`, inline:true},
                        {name:'Software', value:`${server.software.name} ${server.software.version}`, inline:true}
                    )
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            }
        } catch(e) {
            console.error(`An error ocurred while running the command 'status' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
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