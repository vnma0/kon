const { writeFileSync } = require("fs");
const { join } = require("path");
const WebSocket = require("ws");

const config = require("./config/server");
const folderCfg = require("./config/folder");
const { sepName } = require("./util/parser");
const createFolder = require("./util/createFolder");

function main() {
    const ws = new WebSocket(config.address);

    createFolder(folderCfg.submitFolder);
    createFolder(folderCfg.logFolder);
    const folder = folderCfg.submitFolder;

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
        const code_path = join(folder, file_name);
        writeFileSync(code_path, sub.data, { encoding: "base64" });
    };
}

main();
