/**
 * Limit accept file type
 * Google "MIME" for correct MIME string
 */
const acceptMIME = [
    "text/x-c",
    "text/x-pascal",
    "text/x-java-source",
    "text/x-script.python"
    // More will be availaable
];

/**
 * Limit code size: ~ 10 KB
 * This will make sure server can easily handle code without many problems
 */
const sizeLimit = 10000;

/**
 * Limit zipped task size: ~ 25 MB
 * This will limit request without breaking network
 */
const taskSizeLimit = 25000000;

export default {
    acceptMIME,
    sizeLimit,
    taskSizeLimit
};
