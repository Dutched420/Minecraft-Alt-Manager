const chalk = require("chalk");
const axios = require("axios");
const fs = require("fs");
const yaml = require("js-yaml");
let config = yaml.load(fs.readFileSync(`${process.cwd()}/config.yml`, "utf8"));

module.exports = async (client) => {
    console.clear();

    if(config.startup.versionCheck) {
        axios.get("http://api.github.com/repos/Dutched420/Minecraft-Alt-Manager/releases")
            .then(function (response) {
            if(response.data[0].name.replace(/\D/g, "") > client.version.replace(/\D/g, "")) {
                console.log(chalk.red(`[VERSION]: Outdated! Latest download: ${response.data[0].zipball_url}`));
            };
        });
    };

    console.log(chalk.yellow("             __,__\r\n    .--.  .-\"     \"-.  .--.\r\n   \/ .. \\\/  .-. .-.  \\\/ .. \\\r\n  | |  \'|  \/   Y   \\  |\'  | |\r\n  | \\   \\  \\ 0 | 0 \/  \/   \/ |\r\n   \\ \'- ,\\.-\"`` ``\"-.\/, -\' \/\r\n    `\'-\' \/_   ^ ^   _\\ \'-\'`\r\n        |  \\._   _.\/  |\r\n        \\   \\ `~` \/   \/\r\n         \'._ \'-=-\' _.\'\r\n            \'~---~\'"))
    console.log(chalk.white(" ────────────────────────────────────────────────────────────"))
    console.log(chalk.white(`  [${chalk.greenBright("+")}] Dutched's Alt Manager ${chalk.yellow(`1.5.1`)}`));
    console.log(chalk.white(`  [${chalk.greenBright("+")}] Github: ${chalk.yellow(`https://github.com/Dutched420/Minecraft-Alt-Manager`)}`));
    console.log(chalk.white(" ────────────────────────────────────────────────────────────"))
    console.log(
        chalk.magenta.bold("[DISCORD]: " + client.user.tag + " is online")
    );
};
