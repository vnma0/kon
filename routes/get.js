import express from "express";
import { join } from "path";
import { readdirSync } from "fs";

import { submitFolder, cwd } from "../config/folder";
import { checkStatus } from "../middleware/validate";
import { parseLog, isFile } from "../util/parser";
import { unlinkAsync } from "../util/clean";

const router = express.Router();

/**
 * /get - /GET
 * @description Return array's of log from Themis
 * This route use parseLog - async function, which enhance run time
 * TODO: enhance parseLog usage
 */
router.get("/", checkStatus, (req, res) => {
    // TOOO: Seperate session to make the log private
    // Folder contain log
    const logFolder = join(cwd, submitFolder, "Logs");

    const fileList = readdirSync(logFolder)
        .map((file) => join(logFolder, file)) // Convert into fullpath
        .filter(isFile); // Filter files only

    // Convert into Promises
    const promiseLogs = fileList.map(parseLog);
    if (!promiseLogs.length) {
        res.send([]);
        return;
    }
    // Asynchronously parse all log file then send it back as response
    Promise.all(promiseLogs)
        .then((result) => res.send(result))
        .catch((err) => {
            throw err;
        });

    // TODO: Delete sent logs
    Promise.all(fileList.map(unlinkAsync)).catch((err) => {
        throw err;
    });
});

export { router as get };
