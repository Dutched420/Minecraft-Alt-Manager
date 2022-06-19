/**
 * @author Dutch
 * @version 1.6.0
*/

const { Client, Collection, Intents } = require("discord.js");
const { verify, createBots} = require("./src/utilities/functions/functions");
const fs = require("fs");
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

if (config.startup.verify) {
    verify();
};

const client = new Client({
  allowedMentions: { parse: ["users", "roles"] },
  fetchAllMembers: false,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.version = "1.6.0"; // Changing this will mess with the update notifier
process.onlineBots = [];
process.bots = [];
createBots();

["commands", "events"].forEach((file) => {
  require(`./src/utilities/handlers/${file}`)(client);
});

client.login(config.discord.botToken);