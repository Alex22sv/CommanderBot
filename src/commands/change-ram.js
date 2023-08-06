const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change-ram')
        .setDescription(commandDescriptions['change-ram'])
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        )
        .addNumberOption(option => 
            option.setName('ram')
                .setDescription('The amount of RAM that you want to assign to your server.')
                .setRequired(true)),
    async run(bot, interaction) {
        try{ 
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            let newRam = interaction.options.getNumber('ram');
            let currentRam = await server.getRAM();
            if(newRam < 2 || newRam > 16) {
                const invalidValueEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('RAM must be in range of 2-16.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[invalidValueEmbed], ephemeral:true});
            }
            if(newRam === currentRam) {
                const sameValueEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription(`The RAM is already set to **${currentRam}GB**.`)
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[sameValueEmbed], ephemeral:true})
            }
            await server.setRAM(newRam);
            const updatedRAM = new MessageEmbed()
                .setDescription(`The RAM of the server **${server.name}** has changed from **${currentRam}GB** to **${newRam}GB**.`)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            return interaction.reply({ embeds:[updatedRAM], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'change-ram' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "This is only possible when your server is offline."){
                const serverNotOfflineEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('This is only possible when your server is offline.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[serverNotOfflineEmbed], ephemeral:true});
                
            } 
            if(e.message == "Cannot read properties of undefined (reading 'getRAM')"){
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