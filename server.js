import express from "express";
import { address } from "ip";
import { join } from "path";
import { readdirSync, unlink } from "fs";

import { uploadForm, submitFolder } from "./config/upload";
import { checkStatus, validateCode } from "./middleware/validate";
import { submitToThemis } from "./core/submit";
import { parseLog, isFile } from "./util/parser";
import { cleanTemp } from "./util/clean";

const app = express();

const PORT = 30000;

/**
 * /submit - /POST
 * @description Receive source code from Wafter and then move it to Themis
 */
app.post("/submit", checkStatus, uploadForm, validateCode, (req, res) => {
    const code = req.files.code[0];
    const id = req.body.id;
    // Verbose
    console.log(`[${req.ip}] /submit "${code.originalname}" (${id})"`);

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
 * /check - /GET
 * @description Check if server has done handshake.
 */
app.get("/check", checkStatus, (req, res) => {
    // Verbose
    console.log(`[${req.ip}] /check`);

    // Response: 200 OK
    res.sendStatus(200);
});

/**
 * /get - /GET
 * @description Return array's of log from Themis
 * This route use parseLog - async function, which enhance run time
 * TODO: enhance parseLog usage
 */
app.get("/get", (req, res) => {
    // Verbose
    console.log(`[${req.ip}] /get`);

    // Folder contain log
    const logFolder = join(__dirname, submitFolder, "Logs");

    const fileList = readdirSync(logFolder)
        .filter(file => file) // Filter empty string
        .map(file => join(logFolder, file)) // Convert into fullpath
        .filter(isFile); // Filter files only

    // Convert into Promises
    const promiseLogs = fileList.map(parseLog);
    // Asynchronously parse all log file then send it back as response
    Promise.all(promiseLogs).then(result => res.send(result));

    // Delete sent logs
    Promise.all(fileList.map(unlink));
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
