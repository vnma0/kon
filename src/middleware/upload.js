"use strict";

const multer = require("multer");
const { uploadFolder } = require("../config/folder");
const code = require("../config/code");

/**
 * Multer middleware wrapper to limit upload size
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Multer} multerMid multer middleware
 * @returns {Middleware} wrapped middleware
 */
function limitUpload(multerMid) {
    return (req, res, next) => {
        multerMid(req, res, (err) => {
            const isMulterLimit =
                err instanceof multer.MulterError &&
                err.code === "LIMIT_FILE_SIZE";
            if (isMulterLimit) {
                res.sendStatus(413);
            } else if (err) {
                res.sendStatus(400);
            } else next();
        });
    };
}

/**
 * receive task from Wafter
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
const taskUpload = limitUpload(
    multer({
        dest: uploadFolder,
        limits: {
            fileSize: code.taskSizeLimit,
            files: 1,
            parts: 1,
            preservePath: true
        }
    }).single("task")
);

/**
 * receive submission from Wafter
 * If payload is too large, send status 413
 * If there's other error, send status 400
 * Else, next()
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {callback} next Express next middleware function
 */
const formUpload = limitUpload(
    multer({
        dest: uploadFolder,
        limits: {
            fileSize: code.sizeLimit,
            files: 1,
            parts: 2,
            preservePath: true
        }
    }).fields([{ name: "code", maxCount: 1 }, { name: "id", maxCount: 1 }])
);

module.exports = { taskUpload, formUpload };
