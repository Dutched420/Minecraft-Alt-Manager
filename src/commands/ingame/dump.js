const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = {
    name: 'dump',
    description: 'Make a specific alt drop all its items',
    usage: '<prefix>dump',
    aliases: ["tossall", "dumpall"],
    dir: "ingame",
	permissions: ["ADMINISTRATOR"],
    
    run : async (client, message, args) => {

        const bots = process.bots;
        const usernames = bots.map(bot => bot.username);
        let botInfo = "";
        
        if(args.length == 0) {

            const embed = new MessageEmbed({
                title: config.format.errorTitle,
                description: "No alt username specified.",
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
					for (i = eachBot.inventory.items().length+1; i > 0; i--) {
						await sleep(100);
						function tossNext () {
							if (eachBot.inventory.items().length === 0) return;
							const item = eachBot.inventory.items()[0];
							eachBot.tossStack(item, tossNext);
						}
						tossNext();
					}
				}
				continue;
            };

            const embed = new MessageEmbed({
                title: config.format.successTitle,
                description: `Inventory dropped for **${args[0]}**`,
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