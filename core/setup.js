import extract from "extract-zip";
import { cwd } from "../config/folder";
import { join } from "path";

/**
 * Extract Tasks file to Current Working Directory
 * @param {PathLike} filePath path to zip file
 */
export async function extractTasks(filePath) {
    extract(filePath, { dir: join(cwd, "Tasks") }, (err) => {
        if (err) throw err;
    });
}
