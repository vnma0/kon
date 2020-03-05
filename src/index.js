const { writeFile } = require("fs");
const { join } = require("path");
const WebSocket = require("ws");
const chokidar = require("chokidar");

const config = require("./config/server");
const folderCfg = require("./config/folder");
const { sepName, parseLog } = require("./util/parser");
const createFolder = require("./util/createFolder");

function main() {
    // Generate folder
    const submitFolder = join(folderCfg.cwd, folderCfg.submitFolder);
    const logFolder = join(folderCfg.cwd, folderCfg.logFolder);
    createFolder(submitFolder);
    createFolder(logFolder);

    const ws = new WebSocket(config.address);

    ws.onmessage = msg => {
        // Send file to submit folder
        try {
            msg.data = JSON.parse(msg.data);
        } catch (err) {
            console.log("Invalid message");
        }
        const sub = msg.data;
        console.log(`Recieved submissions ${sub.id}`);
        const [prob, ext] = sepName(sub.name);
        const file_name = `[${sub.id}][${prob}]${ext}`;
        const code_path = join(submitFolder, file_name);
        writeFile(code_path, sub.data, { encoding: "base64" }, err => {
            if (err) {
                const result = {
                    id: sub.id,
                    err: "Server error"
                };
                ws.send(JSON.stringify(result));
            }
        });
    };
    // TODO: Ignore unrelated files
    const logWatch = chokidar.watch(logFolder, {
        depth: 1,
        persistent: true,
        awaitWriteFinish: true
    });
    ws.onopen = _ => {
        logWatch.on("add", async path => {
            const msg = await parseLog(path);
            console.log(`Sending message ${msg.id}`);
            console.log(msg);
            ws.send(JSON.stringify(msg));
        });
    };

    ws.onclose = _ => {
        logWatch.close();
    };
}

main();
