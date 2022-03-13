const chalk = require("chalk");
const mineflayer = require("mineflayer"); 
const fs = require("fs");
const yaml = require("js-yaml");

let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));
var promise = Promise.resolve();

module.exports.createBots = () => {
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
                    bot.chat(config.minecraft.joinCommand);
                    process.onlineBots.push(bot.username);
                    process.bots.push(bot);
                    console.log(chalk.green.bold(`[ALTS]: ${bot.username} logged in`));
                };
            });
            bot.on("end", () => {
                console.log(chalk.red.bold(`[ALTS]: ${bot.username} logged off`));
                process.onlineBots.splice(process.onlineBots.indexOf(bot.username), 1);
            });
            bot.on("death", () => {
                console.log(chalk.red.bold(`[ALTS]: ${bot.username} died, respawning it..`));
            });
            bot.on("kicked", () => {
                console.log(chalk.red.bold(`[ALTS]: ${bot.username} got kicked, relogging it..`));
            });
            return new Promise(function (resolve) {
                setTimeout(resolve, config.minecraft.joinDelay * 1000);
            });
        });
    });
};

module.exports.destroyBots = () => {
    process.bots = [];
    process.onlineBots = [];
};


// Small verification function, I got way too many DM's of people that had an old NodeJS version/messed up config
module.exports.verify = () => {
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