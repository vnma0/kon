import { promisify } from "util";
import { readdir } from "fs";
import { submitFolder } from "../config/upload";

/**
 * Return number of files in queue
 */
export async function getQueue() {
    const readdirAsync = promisify(readdir);
    const filesInQueue = await readdirAsync(submitFolder);
    // TODO: filter folder
    return filesInQueue.length;
}
