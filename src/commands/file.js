const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('file')
        .setDescription(commandDescriptions.file)
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Send the server name, ID or address here.')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('file')
                .setDescription('Send the name of the file here.')
                .setRequired(true)),
    async run(bot, interaction) {
        try{ 
            let name = interaction.options.getString('server');
            let serverLists = await exarotonClient.getServers();
            let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
            let fileName = interaction.options.getString('file');
            let file = await server.getFile(fileName);
            await file.getInfo()
            if(fileJson.isTextFile && fileJson.isReadable){
                let content = await file.getContent();
                const fileEmbed = new MessageEmbed()
                    .setTitle(`Content of file ${fileName}`)
                    .setDescription(content)
                    .setColor(embedColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({ embeds:[fileEmbed], ephemeral:false});
            }
            if(!fileJson.isTextFile) {
                const notTextFileEmbed = new MessageEmbed()
                    .setTitle("Error!")
                    .setDescription(`The file **${fileName}** is not a text file.`)
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[notTextFileEmbed], ephemeral:false});
            }
            if(!fileJson.isReadable) {
                const notReadableEmbed = new MessageEmbed()
                    .setTitle("Error!")
                    .setDescription(`The file **${fileName}** is not readable.`)
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[notReadableEmbed], ephemeral:false});
            }
        } catch(e) {
            console.error(`An error ocurred while running the command 'file' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
            if(e.message == "Cannot read properties of undefined (reading 'getFile')"){
                const serverNotFoundEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('That server does not exist.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[serverNotFoundEmbed], ephemeral:true});
            }
            if(e.message.includes('404')){
                const fileNotFoundEmbed = new MessageEmbed()
                    .setTitle('Error!')
                    .setDescription('That file does not exist.')
                    .setColor(errorColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({embeds:[fileNotFoundEmbed], ephemeral:true})
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