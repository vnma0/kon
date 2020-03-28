"use strict";

require("dotenv").config();

/**
 * Set true to see server log
 */
const logRequest = true;

// key must be available in order to work
if (process.env.key === undefined)
    throw "Environment variable 'key' must be available to run";

module.exports = {
    address: process.env.wafter,
    key: process.env.key,
    logRequest: logRequest
};
