import multer from "multer";
import { uploadFolder } from "../config/folder";
import { taskSizeLimit, codeSizeLimit } from "../config/code";

/**
 * Form structure which is used to receives Wafter request
 * Do not set this to multer().any() !!!!
 * See https://github.com/expressjs/multer for details
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
