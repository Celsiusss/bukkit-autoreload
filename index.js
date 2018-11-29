const Rcon = require('rcon-srcds');
const fs = require('fs');
const path = require('path');

const rcon = new Rcon({
    host: '127.0.0.1',
    port: '25575',
    maximumPacketSize: 0,
    encoding: 'utf8',
    timeout: 1000
});

const filePaths = {
    out: 'C:\\dev\\bentobox\\target',
    plugins: 'C:\\Users\\Daniel\\Desktop\\mcseerver\\plugins',
    fileName: 'bentobox-0.15.0-SNAPSHOT.jar'
};

const files = {
    outFile: path.resolve(filePaths.out, filePaths.fileName),
    pluginFile: path.resolve(filePaths.plugins, filePaths.fileName)
};

(async () => {

    try {
        await rcon.authenticate('password');
        console.log('connected to minecraft server');
        await rcon.execute('say connected to autoreload');

        fs.watch(filePaths.out, {encoding: 'utf8'}, (eventType, fileName) => {
            console.log(eventType);
            console.log(fileName);

            if (fileName === filePaths.fileName) {
                fs.copyFile(files.outFile, files.pluginFile, async (err) => {
                    if (err) return console.error(err);
                    await rcon.execute('say file change detected, reloading');
                    await rcon.execute('reload');
                    console.log('copied file');
                });
            }
        })
    } catch (e) {
        console.error(e);
    }
    
})();
