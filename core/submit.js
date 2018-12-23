import { copyFile } from "fs";
import { submitFolder } from "../config/upload";
import { join, basename, extname } from "path";
import { cleanLog } from "../util/clean";
import { sepName } from "../util/parser";

/**
 * Move source code to submit folder
 * @param {String} code Source code goes here
 * @param {String} id Submission id
 */
export async function submitToThemis(code, id) {
    // cleanLog();
    const [base, ext] = sepName(code.originalname);
    const newName = `[${id}][${base}]${ext}`;
    const dest = join(submitFolder, newName);
    console.log(dest);

    copyFile(code.path, dest, err => {
        if (err) console.log(err);
    });
}
