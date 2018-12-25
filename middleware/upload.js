import multer from "multer";
import { uploadFolder } from "../config/folder";
import { taskSizeLimit, codeSizeLimit } from "../config/code";

/**
 * receive task from Wafter
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function taskUpload(req, res, next) {
    const task = multer({
        dest: uploadFolder,
        limits: {
            fileSize: taskSizeLimit,
            files: 1,
            parts: 1,
            preservePath: true
        }
    }).single("task");

    task(req, res, err => {
        if (
            err instanceof multer.MulterError &&
            err.code === "LIMIT_FILE_SIZE"
        ) {
            res.sendStatus(413);
        } else if (err) {
            res.sendStatus(400);
        } else next();
    });
}

/**
 * receive submission from Wafter
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
export function formUpload(req, res, next) {
    const form = multer({
        dest: uploadFolder,
        limits: {
            fileSize: codeSizeLimit,
            files: 1,
            parts: 2,
            preservePath: true
        }
    }).fields([{ name: "code", maxCount: 1 }, { name: "id", maxCount: 1 }]);

    form(req, res, err => {
        if (
            err instanceof multer.MulterError &&
            err.code === "LIMIT_FILE_SIZE"
        ) {
            res.sendStatus(413);
        } else if (err) {
            res.sendStatus(400);
        } else next();
    });
}
