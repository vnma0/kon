import { copyFile } from "fs";
import { submitFolder } from "../config/folder";
import { join } from "path";
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

    copyFile(code.path, dest, (err) => {
        if (err) throw err;
    });
}
