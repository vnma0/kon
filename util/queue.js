import { promisify } from "util";
import { readdir } from "fs";
import { submitFolder } from "../config/upload";
import { isFile } from "./parser";

/**
 * Return number of files in queue
 */
export async function getQueue() {
    const readdirAsync = promisify(readdir);
    const filesInQueue = (await readdirAsync(submitFolder)).filter(isFile);
    return filesInQueue.length;
}
