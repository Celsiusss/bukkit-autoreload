const Rcon = require('rcon-srcds');
const fs = require('fs');
const path = require('path');

const filePaths = {
    out: 'D:\\dev\\SkyMechanics\\target',
    plugins: 'D:\\Users\\daniel\\Desktop\\minecraft server\\plugins',
    fileName: 'SkyMechanics-1.0-SNAPSHOT.jar'
};

const files = {
    outFile: path.resolve(filePaths.out, filePaths.fileName),
    pluginFile: path.resolve(filePaths.plugins, filePaths.fileName)
};

async function run() {
    const rcon = new Rcon({
        host: '127.0.0.1',
        port: '25575',
        maximumPacketSize: 0,
        encoding: 'utf8',
        timeout: 1000
    });

    let changed = false;

    try {
        await rcon.authenticate('password');
        console.log('connected to minecraft server');
        await rcon.execute('say connected to autoreload');

        fs.watch(filePaths.out, {encoding: 'utf8'}, async (eventType, fileName) => {
            console.log(eventType);
            console.log(fileName);

            if (fileName === filePaths.fileName && !changed) {
                changed = true;
                setTimeout(async () => {
                    fs.copyFile(files.outFile, files.pluginFile, async (err) => {
                        console.log('copied file');
                        if (err) return console.error(err);
                        try {
                            console.log('reloading server');
                            await rcon.execute('say file change detected, reloading');
                            await rcon.execute('reload');

                            await rcon.disconnect();
                            setTimeout(() => {
                                return run();
                            }, 5000)
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }, 400);

            }
        })
    } catch (e) {
        console.error(e);
    }
    
}
run();
