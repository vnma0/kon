import multer from "multer";
import { uploadFolder, taskFolder } from "../config/folder";
/**
 * Form structure which is used to receives Wafter request
 * Do not set this to multer().any() !!!!
 * See https://github.com/expressjs/multer for details
 */
export const uploadForm = multer({ dest: uploadFolder }).fields([
    { name: "code", maxCount: 1 },
    { name: "id", maxCount: 1 }
]);

export const taskUpload = multer({
    dest: taskFolder,
    limits: { fileSize: 25000000 }
}).single("task");
