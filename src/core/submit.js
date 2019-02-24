const { copyFile } = require("fs");
const { submitFolder } = require("../config/folder");
const { join } = require("path");
const { sepName } = require("../util/parser");

/**
 * Move source code to submit folder
 * @param {String} code Source code goes here
 * @param {String} id Submission id
 */
async function submitToThemis(code, id) {
    // cleanLog();
    const [base, ext] = sepName(code.originalname);
    const newName = `[${id}][${base}]${ext}`;
    const dest = join(submitFolder, newName);

    copyFile(code.path, dest, (err) => {
        if (err) throw err;
    });
}

module.exports = submitToThemis;
