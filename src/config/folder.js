"use strict";

/**
 * Current Working Directory
 */
const cwd = process.cwd();

/**
 * Folder contains log result after submit code
 * This is where /get will take log and send back to Wafter
 */
const submitFolder = "submit";

const logFolder = submitFolder + "/Logs";

module.exports = { cwd, submitFolder, logFolder };
