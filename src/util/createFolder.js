const { existsSync, mkdirSync } = require("fs");

function createFolder(folder) {
    if (!existsSync(folder)) mkdirSync(folder);
}

module.exports = createFolder;