"use strict";

const { readdirSync } = require("fs");
const { cwd, submitFolder } = require("../config/folder");
const { isFile } = require("./parser");
const { join } = require("path");

/**
 * Get queue
 * @returns {Number} number of files in queue
 */
function getQueue() {
    const workDir = join(cwd, submitFolder);
    const filesInFolder = readdirSync(workDir);
    // TODO: Filter queue
    const filesInQueue = filesInFolder
        .map((file) => join(workDir, file))
        .filter(isFile);
    return filesInQueue.length;
}

module.exports = getQueue;
