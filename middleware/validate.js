import { acceptMIME, codeSizeLimit } from "../config/code";
import status from "../core/status";

/**
 * Check if server is ready
 * If not ready, send status 503
 * Else, call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function checkStatus(req, res, next) {
    if (status.ready) next();
    else res.sendStatus(503);
}

/**
 * Check if recieved file is a valid source code
 * If the received file is empty, send status 400
 * Else if file's size is over limit, send status 413
 * Else if file's type is incorrect, send status 415
 * Else call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function validateCode(req, res, next) {
    const files = req.files;
    // Check for invalid code
    if (!files.code) res.sendStatus(400);
    else {
        const code = files.code[0];
        if (!checkFileSize(code)) res.sendStatus(413);
        else if (!checkFileType(code)) res.sendStatus(415);
        else next();
    }
}

/**
 * Check if given file is a valid source code via MIME
 * @param {Object} file source code blob
 */
function checkFileType(file) {
    return acceptMIME.indexOf(file.mimetype) !== -1;
}

/**
 * Check if given file's size is under codeSizeLimit
 * @param {Object} file source code blob
 */
function checkFileSize(file) {
    return file.size < codeSizeLimit;
}
