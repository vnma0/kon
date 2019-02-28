"use strict";

require("dotenv").config();

/**
 * Server port
 */
const PORT = isNaN(process.env.PORT) ? 30000 : process.env.PORT;

/**
 * Set true to see server log
 */
const logRequest = true;

module.exports = {
    PORT: PORT,
    logRequest: logRequest
};
