const fs = require('fs');

module.exports = async (client) => {
    fs.readdir(`${__dirname}/../../commands/`, (err, files) => {
        if (err) console.log(err);
        files.forEach(dir => {
            fs.readdir(`${__dirname}/../../commands/${dir}/`, (err, file) => {
                if (err) console.log(err);
                file.forEach(f => {
                    const props = require(`${__dirname}/../../commands/${dir}/${f}`);
                    client.commands.set(props.name, props);
                    props.aliases.forEach(alias => {
                        client.aliases.set(alias, props.name);
                    });
                });
            });
        });
    });
};