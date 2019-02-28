"use strict";

const { existsSync, mkdirSync } = require("fs");

/**
 * Current Working Directory
 */
const cwd = process.cwd();

/**
 * Folder contains log result after submit code
 * This is where /get will take log and send back to Wafter
 */
const submitFolder = "submit";

if (!existsSync(submitFolder)) mkdirSync(submitFolder);

/**
 * Folder contains upload files where code is uploaded to
 */
const uploadFolder = "upload";

module.exports = { cwd, submitFolder, uploadFolder };
