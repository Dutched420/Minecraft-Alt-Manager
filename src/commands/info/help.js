const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = {
    name: 'help',
    description: 'Display the help menu',
    usage: '<prefix>restart',
    aliases: ["commands"],
    dir: "info",
    permissions: ["SEND_MESSAGES"],
    
    run : async (client, message, args) => {

        const commands = client.commands.map(command => `**${command.name}:** ${command.description.toLowerCase()}`);

        const embed = new MessageEmbed({
            title: `Help menu`,
            description: `Commands:\n${commands.join("\n")}`,
            color: config.format.embedColor,
            footer: {
                text: config.format.footer
            },
        });

        return message.reply({
            embeds: [embed]
        });

    },
};