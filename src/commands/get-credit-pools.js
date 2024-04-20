const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-credit-pools')
        .setDescription(commandDescriptions['get-credit-pools']),
    async run(bot, interaction) {
        try{ 
            let account = await exarotonClient.getAccount();
            let pools = await exarotonClient.getPools();
            let string = '';
            if(pools.length == 0) {
                const noPoolFound = new MessageEmbed()
                    .setDescription(`The exaroton account **${account.name}** has no pools.`)
                    .setColor(embedColor)
                    .setTimestamp()
                    .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                return interaction.reply({ embeds:[noPoolFound], ephemeral:false});
            } else{
                    for(let pool of pools){
                        string += `${pool.name} (${pool.id}): ${pool.credits} credits, ${pool.servers} servers, ${pool.members} members\n`;
                    }
                    const listPoolsEmbed = new MessageEmbed()
                        .setTitle(`${account.name}'s pools`)
                        .setDescription(string)
                        .setColor(embedColor)
                        .setTimestamp()
                        .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
                    return interaction.reply({ embeds:[listPoolsEmbed], ephemeral:false});
            }
        } catch(e) {
            console.error(`An error ocurred while running the command 'get-credit-pools' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
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