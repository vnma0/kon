import multer from "multer";

/**
 * Folder contains log result after submit code
 * This is where /get will take log and send back to Wafter
 */
export const submitFolder = "submit";

/**
 * Folder contains upload files where code is uploaded to
 */
export const uploadFolder = "upload";
/**
 * Form structure which is used to receives Wafter request
 * Do not set this to multer().any() !!!!
 * See https://github.com/expressjs/multer for details
 */
export const uploadForm = multer({ dest: uploadFolder }).fields([
    { name: "code", maxCount: 1 },
    { name: "id", maxCount: 1 }
]);
