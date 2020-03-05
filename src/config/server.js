"use strict";

require("dotenv").config();

/**
 * Set true to see server log
 */
const logRequest = true;

module.exports = {
    address: process.env.wafter,
    logRequest: logRequest
};
