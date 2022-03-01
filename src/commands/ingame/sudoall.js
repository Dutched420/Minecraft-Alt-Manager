const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = {
    name: 'sudoall',
    description: 'make every alt say something',
    usage: '<prefix>sudoall',
    aliases: [],
    dir: "ingame",
    permissions: ["ADMINISTRATOR"],
    
    run : async (client, message, args) => {
        
        const bots = client.bots
        
        for (eachBot of bots) {
            eachBot.chat(args.join(" "));
        };

        const embed = new MessageEmbed({
            title: config.format.successTitle,
            description: `\`"${args.join(" ")}"\` has been sent on **${bots.length}** alts!`,
            color: config.format.embedColor,
            footer: {
                text: config.format.footer
            },
        });

        message.reply({
            embeds: [embed]
        });

    },
};