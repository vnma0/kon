require("dotenv").config();

/**
 * Server port
 */
const PORT = isNaN(process.env.PORT) ? 30000 : process.env.PORT;

/**
 * Set true to see server log
 */
export const logRequest = true;

export default {
    PORT: PORT,
    logRequest: logRequest
};
