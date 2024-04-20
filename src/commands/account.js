const {embedColor, errorColor, exarotonAPIkey} = require('../config.json');
const commandDescriptions = require('../commandDescriptions.json')
const {Client} = require('exaroton');
const exarotonClient = new Client(exarotonAPIkey);
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('account')
        .setDescription(commandDescriptions.account),
    async run(bot, interaction) {
        try{ 
            let account = await exarotonClient.getAccount();
            if (account.verified == true) {
                embedDescription = 'verified'
            } else if (account.verified == false) {
                embedDescription = 'not verified'
            }
            const accountEmbed = new MessageEmbed()
                .setDescription(`The exaroton account **${account.name}** is ${embedDescription} and currently has **${account.credits}** credits.`)
                .setColor(embedColor)
                .setTimestamp()
                .setFooter({text:interaction.user.tag, iconURL:interaction.user.displayAvatarURL()})
            interaction.reply({ embeds:[accountEmbed], ephemeral:false});
        } catch(e) {
            console.error(`An error ocurred while running the command 'account' executed by ${interaction.user.tag}(${interaction.user.id}): ${e}`)
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