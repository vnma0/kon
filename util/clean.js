import { readdirSync, unlinkSync } from "fs";
import { submitFolder, uploadFolder } from "../config/upload";
import { join } from "path";

/**
 * Empty a folder by deleting all files
 * This function won't delete any folder inside given folder
 * @param {PathLike} path path to folder need cleaning
 */
function cleanFolder(path) {
    const files = readdirSync(path);
    files.map(file => unlinkSync(join(path, file)));
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
