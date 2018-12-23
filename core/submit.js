import { copyFile } from "fs";
import { submitFolder } from "../config/upload";
import { join, basename, extname } from "path";
import { cleanLog } from "../util/clean";

/**
 * Move source code to themis folder
 * @param {String} code source code goes here
 * @param {String} id submission id
 */
export async function submitToThemis(code, id) {
    // cleanLog();
    const ext = extname(code.originalname);
    const base = basename(code.originalname, ext);
    const newName = `[${id}][${base}]${ext}`;
    const dest = join(submitFolder, newName);
    console.log(dest);

    copyFile(code.path, dest, err => {
        if (err) console.log(err);
    });
}
