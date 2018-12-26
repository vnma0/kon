import express from "express";
import { address } from "ip";
import { join } from "path";
import { readdirSync } from "fs";
import helmet from "helmet";
import morgan from "morgan";

import { submitFolder, cwd } from "./config/folder";
import { formUpload, taskUpload } from "./middleware/upload";
import {
    checkStatus,
    checkInitial,
    validateCode,
    validateTask
} from "./middleware/validate";
import { submitToThemis } from "./core/submit";
import { parseLog, isFile } from "./util/parser";
import { cleanTemp, unlinkAsync } from "./util/clean";
import status from "./core/status";
import { extractTasks } from "./core/setup";

const app = express();

const PORT = 30000;

app.use(helmet());
// Safety first
app.use(morgan("tiny"));

/**
 * /task - /POST
 * @description Recieve task from Wafter. This route run for once only
 */
app.post("/task", checkInitial, taskUpload, validateTask, (req, res) => {
    const taskZipPath = req.file.path;
    extractTasks(taskZipPath).then(() => {
        status.setReady();
        res.sendStatus(200);
    });
});

/**
 * /check - /GET
 * @description Check if server has done handshake.
 */
app.get("/check", checkStatus, (req, res) => {
    res.sendStatus(200);
});

/**
 * /submit - /POST
 * @description Receive source code from Wafter and then move it to Themis
 */
app.post("/submit", checkStatus, formUpload, validateCode, (req, res) => {
    const code = req.files.code[0];
    const id = req.body.id;

    // Verify id
    if (!id) {
        // Response: 400 Bad Request
        res.sendStatus(400);
        return;
    }
    submitToThemis(code, id);

    // Response: 200 OK
    res.sendStatus(200);
});

/**
 * /get - /GET
 * @description Return array's of log from Themis
 * This route use parseLog - async function, which enhance run time
 * TODO: enhance parseLog usage
 */
app.get("/get", checkStatus, (req, res) => {
    // Folder contain log
    const logFolder = join(cwd, submitFolder, "Logs");

    const fileList = readdirSync(logFolder)
        .filter(file => file) // Filter empty string
        .map(file => join(logFolder, file)) // Convert into fullpath
        .filter(isFile); // Filter files only

    // Convert into Promises
    const promiseLogs = fileList.map(parseLog);
    // Asynchronously parse all log file then send it back as response
    Promise.all(promiseLogs).then(result => res.send(result));

    // TODO: Delete sent logs
    Promise.all(fileList.map(unlinkAsync)).catch(console.error);
});

/**
 * Start server
 * @description This will start listen at port PORT
 */
app.listen(PORT, () => {
    // TODO: clean everything before start
    cleanTemp();
    // Verbose
    console.log(`Server is listening on ${address()} at ${PORT}`);
});

// TODO: clean code
