import { join } from "path";

/**
 * Current Working Directory
 */
export const cwd = join(__dirname, "..");

/**
 * Folder contains log result after submit code
 * This is where /get will take log and send back to Wafter
 */
export const submitFolder = "submit";

/**
 * Folder contains upload files where code is uploaded to
 */
export const uploadFolder = "upload";
