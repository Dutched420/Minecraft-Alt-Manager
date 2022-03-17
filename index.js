/**
 * @file Main file
 * @author Dutch
 * @version 1.5.1
 */

// Requirements
const { Client, Collection, Intents } = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");
const functions = require("./src/utilities/functions/functions");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

if(config.startup.verify) {
    functions.verify()
};

const client = new Client({
    allowedMentions: { parse: ['users', 'roles'] },
    fetchAllMembers: false,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.version = "1.5.1"
process.onlineBots = [];
process.bots = [];

["commands", "events"].forEach(file => { require(`./src/utilities/handlers/${file}`)(client) } );

functions.createBots();

client.login(config.discord.botToken);
