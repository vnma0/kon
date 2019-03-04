"use strict";

const express = require("express");
const { join } = require("path");
const { readdirSync, mkdirSync, existsSync } = require("fs");

const { submitFolder, cwd } = require("../config/folder");
const { parseLog, isFile } = require("../util/parser");
const { unlinkAsync } = require("../util/clean");

const router = express.Router();

/**
 * /get - /GET
 * @description Return array's of log from Themis
 * This route use parseLog - async function, which enhance run time
 * TODO: enhance parseLog usage
 */
router.get("/", (req, res) => {
    // TOOO: Seperate session to make the log private
    // Folder contain log
    const logFolder = join(cwd, submitFolder, "Logs");
    if (!existsSync(logFolder)) mkdirSync(logFolder);

    const fileList = readdirSync(logFolder)
        .map((file) => join(logFolder, file)) // Convert into fullpath
        .filter(isFile); // Filter files only

    if (!fileList.length) {
        res.send([]);
        return;
    }

    // Convert into Promises
    const promiseLogs = fileList
        .map((x) =>
            parseLog(x)
                .then(unlinkAsync)
                .catch(() => null)
        )
        .filter((x) => x);
    // Asynchronously parse all log file then send it back as response
    Promise.all(promiseLogs)
        .then((result) => res.json(result))
        .catch((err) => {
            res.sendStatus(500);
            throw err;
        });
});

module.exports = router;
