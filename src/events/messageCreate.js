const { Collection } = require("discord.js");
const fs = require("fs")
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = async (client, message, bots) => {
    if(message.author.bot) { return }
    const prefix = config.discord.prefix
        
    if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){ return message.channel.send(`My prefix is \`${prefix}\``) }
    if(!message.content.startsWith(prefix)){ return }

    const command = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
    const args = message.content.split(' ').slice(1);
    let cmd;

    if (client.commands.has(command)) { cmd = client.commands.get(command) }
    else if(client.aliases.has(command)) { cmd = client.commands.get(client.aliases.get(command)) }
    if(!cmd) return;

    const props = require(`../commands/${cmd.dir}/${cmd.name}`);
    
    if (props.permissions) {
        if (!message.member.permissions.has(props.permissions)) {
            return message.reply(`Missing Permissions: ${props.permissions.map(p => `**${p}**`).join(', ')}`)
        }
    }

    try {
        cmd.run(client, message, args, bots);
    } catch (e) {
        client.emit("error", e, message);
    }
};