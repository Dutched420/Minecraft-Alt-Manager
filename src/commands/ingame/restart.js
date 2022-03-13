const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");
const functions = require(`${process.cwd()}/src/utilities/functions/functions`)

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = {
    name: 'restart',
    description: 'Restart all the alts',
    usage: '<prefix>restart',
    aliases: ["relog"],
    dir: "ingame",
    permissions: ["ADMINISTRATOR"],
    
    run : async (client, message, args) => {

        const embed = new MessageEmbed({
            title: `Are you sure?`,
            description: `There are currently **${process.bots.length}/${config.alts.length}** alts online`,
            color: config.format.embedColor,
            footer: {
                text: config.format.footer
            },
        });
        const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("restart")
                .setLabel("✔️ Restart")
                .setStyle("SUCCESS"),
        )
        .addComponents(
            new MessageButton()
                .setCustomId("cancel")
                .setLabel("❌ Cancel")
                .setStyle("DANGER"),
        );
        let msg = await message.reply({
            embeds: [embed],
            components: [buttons]
        });

        const collector = msg.channel.createMessageComponentCollector({ time: 15000 });
        
        collector.on("collect", async i => {
            if(i.customId === "restart") {
                functions.destroyBots();
                functions.createBots();
                const embed = new MessageEmbed({
                    title: `Restarting`,
                    description: `Restart issued by: ${message.author}\nLogging on **${config.alts.length}** alts. ETA: ${Math.floor(config.alts.length * config.minecraft.joinDelay)} seconds`,
                    color: config.format.embedColor,
                    footer: {
                        text: config.format.footer
                    },
                });
                return msg.edit({
                    embeds: [embed], 
                    components: []
                });
            };
            if(i.customId === "cancel") {
                const embed = new MessageEmbed({
                    title: `Restart Cancelled`,
                    description: `**${process.bots.length}/${config.alts.length}** alts will stay online`,
                    color: config.format.embedColor,
                    footer: {
                        text: config.format.footer
                    },
                });
                return msg.edit({
                    embeds: [embed], 
                    components: []
                });
            };
        });

        collector.on("end", async i => {
            const embed = new MessageEmbed({
                title: `Restart Cancelled`,
                description: `${message.author} took to long to respond`,
                color: config.format.embedColor,
                footer: {
                    text: config.format.footer
                },
            });
            msg.edit({
                embeds: [embed], 
                components: []
            });
        });

    },
};