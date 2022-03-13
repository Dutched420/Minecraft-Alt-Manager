const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = {
    name: 'sudo',
    description: 'Make a specific alt say something',
    usage: '<prefix>sudo',
    aliases: ["alt", "alts"],
    dir: "ingame",
    permissions: ["ADMINISTRATOR"],
    
    run : async (client, message, args) => {

        const bots = process.bots;
        const usernames = bots.map(bot => bot.username);
        let botInfo = "";
        
        if(args.length == 0) {

            bots.forEach(bot => {
                let pos = bot.entity.position
                let split = bot.game.dimension.split(":", 2)
                botInfo += `**${bot.username}**, ${Math.round(pos.x)} ${Math.round(pos.y)} ${Math.round(pos.z)} (${split[1]})\n` 
            });

            const embed = new MessageEmbed({
                title: `There are currently ${bots.length} alts online`,
                description: `**Alts:**\n${botInfo}`,
                color: config.format.embedColor,
                footer: {
                    text: config.format.footer
                },
            });

            return message.reply({
                embeds: [embed]
            });

        } else if(!usernames.includes(args[0])) {

            const embed = new MessageEmbed({
                title: config.format.errorTitle,
                description: `Alt \`"${args[0]}"\` was not found.`,
                color: config.format.embedColor,
                footer: {
                    text: config.format.footer
                },
            });

            return message.reply({
                embeds: [embed]
            });

        } else {

            for (eachBot of bots) {
                if(eachBot.username == args[0]) {
                    eachBot.chat(args.slice(1).join(" "))
                };
                continue;
            };

            const embed = new MessageEmbed({
                title: config.format.successTitle,
                description: `\`${args.slice(1).join(" ")}\` was sent by **${args[0]}**`,
                color: config.format.embedColor,
                footer: {
                    text: config.format.footer
                },
            });

            return message.reply({
                embeds: [embed]
            });
            
        }

    },
};