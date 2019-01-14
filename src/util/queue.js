import { readdirSync } from "fs";
import { cwd, submitFolder } from "../config/folder";
import { isFile } from "./parser";
import { join } from "path";

/**
 * Get queue
 * @returns {Number} number of files in queue
 */
export function getQueue() {
    const workDir = join(cwd, submitFolder);
    const filesInFolder = readdirSync(workDir);
    // TODO: Filter queue
    const filesInQueue = filesInFolder
        .map((file) => join(workDir, file))
        .filter(isFile);
    return filesInQueue.length;
}
