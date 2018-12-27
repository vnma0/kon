import extract from "extract-zip";
import { cwd } from "../config/folder";

/**
 * Extract Tasks file to Current Working Directory
 * @param {PathLike} filePath path to zip file
 */
export async function extractTasks(filePath) {
    extract(filePath, { dir: cwd }, (err) => {
        if (err) throw err;
    });
}
