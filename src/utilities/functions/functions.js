const chalk = require("chalk");
const axios = require("axios");
const mineflayer = require("mineflayer"); 
const fs = require("fs");
const yaml = require("js-yaml");
const functions = require("../functions/functions.js")
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));
var promise = Promise.resolve();

module.exports.destroyBots = () => {
    process.bots = [];
    process.onlineBots = [];
};

module.exports.createBots = async () => {
    config.alts.forEach(function (alt) {
        promise = promise.then(function () {
            const part = alt.split(":", 2);
            let bot;
            bot = mineflayer.createBot({
                username: part[0],
                password: part[1],
                host: config.minecraft.serverIP,
                port: config.minecraft.serverPort,
                version: config.minecraft.version,
                auth: config.minecraft.auth,
                hideErrors: config.minecraft.hideErrors,
                colorsEnabled: false,
                viewDistance: "tiny",
                });
            bot.on("login", () => {
                // Without a check this will execute twice
                if(!process.onlineBots.includes(bot.username)) {
                    sleep(config.minecraft.joinCommandDelay * 1000).then(() => {
						bot.chat(config.minecraft.joinCommand);
						process.onlineBots.push(bot.username);
						process.bots.push(bot);
                        console.log(`  [${chalk.hex("#00FF00").bold("Alts")}]: ${bot.username} logged in`);
					});
                };
            });
            bot.on("end", () => {
                console.log(`  [${chalk.hex("#FF0000").bold("Alts")}]: ${bot.username} logged off, relogging`);
                functions.destroyBots();
                return functions.createBots();
            });
            bot.on("death", () => {
                console.log(`  [${chalk.hex("#FF0000").bold("Alts")}]: ${bot.username} died, respawning`);
                functions.destroyBots();
                return functions.createBots();
            });
            bot.on("kicked", () => {
                console.log(`  [${chalk.hex("#FF0000").bold("Alts")}]: ${bot.username} got kicked, relogging`);
                functions.destroyBots();
                return functions.createBots();
            });
            bot.on("error", (e) => {
                console.log(e);
                console.log(`  [${chalk.hex("#FF0000").bold("Alts")}]: An error occured, restarting`);
                functions.destroyBots();
                return functions.createBots();
            });
            return new Promise(function (resolve) {
                setTimeout(resolve, config.minecraft.joinDelay * 1000);
            });
        });
    });
};

module.exports.restart = async () => {
    setTimeout(() => {
        this.destroyBots();
        this.createBots();
    }, config.autoRestartTime);
};

// Small verification function, I got way too many DM's of people that had an old NodeJS version/messed up config
module.exports.verify = async () => {
    console.log("Verification started");
    console.log("Verifying NodeJS version");
    if(process.version < "v16.0.0") {
        console.log(chalk.red(`[VERIFICATION]: Update your NodeJS. Current version: ${process.version}\nhttps://nodejs.org/en/download/`));
        process.exit();
    };
    console.log("Verifying config");
    try {
        config
    } catch {
        console.log(chalk.red("[VERIFICATION]: Config error"));
        process.exit();
    };
    console.log(chalk.green("[VERIFICATION]: Verified files, starting up.."));
};
