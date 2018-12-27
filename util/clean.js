import { readdirSync, unlink } from "fs";
import { join } from "path";

import { submitFolder, uploadFolder } from "../config/folder";

/**
 * Asynchronous wrapper of unlink
 * @param {PathLike} path path to file
 */
export function unlinkAsync(path) {
    return new Promise((resolve, reject) => {
        unlink(path, err => {
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
    const promise = files.map(file => join(path, file)).map(unlinkAsync);
    Promise.all(promise);
}

/**
 * Clean log folder to make sure of serving fresh result everytime
 */
export function cleanLog() {
    cleanFolder(join(submitFolder, "Logs"));
}

/**
 * Clean upload folder to prevent collison (though this might never happen)
 */
export function cleanTemp() {
    cleanFolder(uploadFolder);
}
