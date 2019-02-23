const extract = require("extract-zip");
const { cwd } = require("../config/folder");
const { join } = require("path");

/**
 * Extract Tasks file to Current Working Directory
 * @param {PathLike} filePath path to zip file
 */
async function extractTasks(filePath) {
    extract(filePath, { dir: join(cwd, "Tasks") }, (err) => {
        if (err) throw err;
    });
}
module.exports = extractTasks;
