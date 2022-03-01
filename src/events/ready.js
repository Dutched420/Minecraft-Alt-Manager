const chalk = require("chalk");
module.exports = async (client) => {
    console.log(
        chalk.magenta.bold("[DISCORD]: " + client.user.tag + " is online")
    );
};