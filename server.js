import express from "express";
import ip from "ip";
import { join } from "path";
import { readdirSync } from "fs";

import { uploadForm, submitFolder } from "./config/upload";
import { checkStatus, validateCode } from "./middleware/validate";
import { submitToThemis } from "./core/submit";
import { parseLog } from "./util/parser";
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
    if (id === "") {
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
 * Check if server has done handshake.
 */
app.get("/check", checkStatus, (req, res) => {
    // Verbose
    console.log(`[${req.ip}] /check`);

    // Response: 200 OK
    res.sendStatus(200);
});

/**
 * /get - /GET
 * Return array's of log from Themis
 * This route use parseLog - async function, which may overtime
 * TODO: enhance parseLog usage
 */
app.get("/get", (req, res) => {
    // Verbose
    console.log(`[${req.ip}] /get`);

    // Folder contain log
    const logFolder = join(__dirname, submitFolder, "Logs");

    const logs = readdirSync(logFolder);
    // TODO: Filter files only using fs.stat() or similar

    // Asynchronously read all log file then send it back to Wafter's request
    Promise.all(logs.map(file => parseLog(join(logFolder, file)))).then(
        result => res.send(result)
    );
});

/**
 * Start server
 * This will start listen at port PORT
 */
app.listen(PORT, () => {
    // TODO: clean everything before start
    cleanTemp();
    // Verbose
    console.log(`Server is listening on ${ip.address()} at ${PORT}`);
});

// TODO: clean code
