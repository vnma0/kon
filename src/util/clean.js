const { readdirSync, unlink } = require("fs");
const { join } = require("path");

const { submitFolder, uploadFolder } = require("../config/folder");

/**
 * Asynchronous wrapper of unlink
 * @param {PathLike} path path to file
 */
function unlinkAsync(path) {
    return new Promise((resolve, reject) => {
        unlink(path, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * Empty a folder by deleting all files
 * This function won't delete any folder inside given folder
 * @param {PathLike} path path to folder need cleaning
 */
function cleanFolder(path) {
    const files = readdirSync(path);
    const promise = files.map((file) => join(path, file)).map(unlinkAsync);
    Promise.all(promise);
}

/**
 * Clean log folder to make sure of serving fresh result everytime
 */
function cleanLog() {
    cleanFolder(join(submitFolder, "Logs"));
}

/**
 * Clean upload folder to prevent collison (though this might never happen)
 */
function cleanTemp() {
    cleanFolder(uploadFolder);
}

module.exports = {
    unlinkAsync,
    cleanLog,
    cleanTemp
};
