import { isBinaryFileSync } from "isbinaryfile";
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
    if (status.ready) {
        if (status.ready === req.ip) next();
        else res.sendStatus(401);
    } else res.sendStatus(503);
}

/**
 * Check if server has been set up
 * If yes, send status 403 (Forbidden)
 * Else, call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function checkInitial(req, res, next) {
    if (status.ready) res.sendStatus(403);
    else next();
}

/**
 * Check if given file is a valid source code by checking if it's binary or not
 * @param {Object} file source code blob
 */
function checkCodeType(file) {
    return !isBinaryFileSync(file.path);
}

/**
 * Check if recieved file is a valid source code
 * If the received file is empty, send status 400
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
        if (!checkCodeType(code)) res.sendStatus(415);
        else next();
    }
}

/**
 * Check if given task file is a vaild zip
 * @param {Object} file zip file blob
 */
function checkTaskType(file) {
    return file.mimetype === "application/zip";
}

/**
 * Check if recieved file is a valid task
 * If the received file is not, send status 400
 * Else if file's type is incorrect, send status 415
 * Else call next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function validateTask(req, res, next) {
    // Check for invalid task file
    const task = req.file;
    if (!task) res.sendStatus(400);
    else {
        if (checkTaskType(task)) next();
        else res.sendStatus(415);
    }
}
