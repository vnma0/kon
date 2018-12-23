import express from "express";
import ip from "ip";
import path from "path";
import { readdirSync } from "fs";

import { uploadForm, submitFolder } from "./config/upload";
import { checkStatus, validateCode } from "./middleware/validate";
import { submitToThemis } from "./core/submit";

const app = express();

const PORT = 30000;

app.post("/submit", checkStatus, uploadForm, validateCode, (req, res) => {
    // status.setBusy(2000);
    let code = req.files.code[0];
    const id = req.body.id;
    // Debug
    console.log(`[${req.ip}] /submit "${code.originalname}" (${id})"`);

    // Verify id
    if (id === "") {
        res.sendStatus(400);
        return;
    }
    submitToThemis(code, id);
    res.sendStatus(200);
});

app.get("/check", checkStatus, (req, res) => {
    // Debug
    console.log(`[${req.ip}] /check`);
    res.sendStatus(200);
});

app.get("/get", (req, res) => {
    // Debug
    console.log(`[${req.ip}] /get`);

    const logFolder = path.join(__dirname, submitFolder, "Logs");
    console.log(logFolder);

    const logs = readdirSync(logFolder);
    // TODO: Filter
    const logFile = logs[0];

    res.sendFile(logFile, {
        root: path.join(logFolder)
    });
    // status.setFree();
});

app.listen(PORT, () => {
    // TODO: clean everything before start
    console.log(`Server is listening on ${ip.address()} at ${PORT}`);
});

// TODO: clean code
