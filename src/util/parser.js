"use strict";

const { readFile, lstatSync } = require("fs");
const esr = require("escape-string-regexp");
const { basename, extname } = require("path");
const { promisify } = require("util");

const verdictDict = require("../config/parser");

/**
 * Call this to check if given filePath is a File in filesystem
 * In order to avoid dependencies, isFile use lstatSync by Node.js
 * to read file's status
 * @param {PathLike} filePath An path string to unknown file
 * @return {Boolean} True if it is, else vice versa
 */
function isFile(filePath) {
    try {
        const stat = lstatSync(filePath);
        return stat.isFile();
    } catch (err) {
        return false;
    }
}

/**
 * @typedef {Object} filenameTuple
 * @property {String} base basename
 * @property {String} ext extension
 */

/**
 * Call this function to convert filename to tuple of base and extension.
 * This function was simply created to solve code duplication issues.
 * @param {PathLike} filename Path to filename
 * @returns {filenameTuple} basename and extension of a filename
 */
function sepName(filename) {
    const ext = extname(filename);
    const base = basename(filename, ext);
    return [base, ext];
}

/**
 * @typedef {Object} logAbsType
 * @property {String} id log's user's id
 * @property {String} problem log's problem
 */

/**
 * This function will extract file name into id and problem name like Themis.
 * It is recommended that the filename is the untouched output from Themis.
 * In case it isn't, the return
 * @param {String} filename log's file name, this include no pathLike string
 * @returns {logAbsType} id and problem of log
 */
function logName2Data(filename) {
    // Read data the same way as Themis
    const [id, problem] = filename
        .match(/\[(.+?)\]/g)
        .map((s) => s.slice(1, -1))
        .slice(-2);

    return { id, problem };
}

const EOL = "\r\n";

/**
 * @typedef {Object} testDetails
 * @property {String} time Test case verdict
 * @property {String} verdict Test verdict
 * @property {String} msg Extra message from Themis and compiler
 */

/**
 * Call this function to seperate time and test.
 * The function was refactored from parseTestCase,
 * in order to keep the code clean.
 * Here's the structure of the Details part in Themis's Log
 *
 * - Time (Optional)
 * - Verdict
 * - Compiler message (Mostly exit code)
 *
 * @param {Array} details Test's details line
 */
function filterDetails(details) {
    let time = null;

    // Check if there's line with running time
    const rTime = /^Thời gian ≈ (.+) giây/;
    if (rTime.test(details[0])) {
        let timeStr = rTime.exec(details[0]);
        time = Number(timeStr[1]);
        details.shift();
    }

    // Put all other details into msg (Good for debugging)

    // Anonymize exit code
    // This won't intervene data comes from Themis
    // If there's problem with ouput, it should be from Themis
    let exitCode = 0;
    let hexStr = "00000000";
    const rExitCode = new RegExp(
        "exit code: (.+) " + esr("(Hexadecimal: ") + "(.+)" + esr(")")
    );
    if (rExitCode.test(details[details.length - 1])) {
        const lastItem = details.pop();
        let filterRes = rExitCode.exec(lastItem);
        exitCode = Number(filterRes[1]);
        hexStr = filterRes[2].padStart(8, "0");
    }

    const msg = details
        .concat(`Process exited with code: ${exitCode} (0x${hexStr})`)
        .join(EOL);

    // Filter Verdict
    const verdict =
        verdictDict[details[details.length - 1]] || verdictDict["default"];

    return { time, verdict, msg };
}

/**
 * @typedef {Object} testCase
 * @property {String} score Final testCase score
 * @property {String} time testCase time
 * @property {String} verdict Final testCase verdict
 * @property {String} details Optional testCase details
 */

/**
 * Use this function to parse rawTestCase into parsedTestCase object.
 * The whole log file is divided into testCases, and parseTestCase is used
 * in order to retrieve acutal result from Themis.
 * @param {Array} rawTestCase raw extraction of testCase from log file
 * @returns {testCase} Parsed test case from rawTestCase
 */
function parseTestCase(rawTestCase) {
    let [score, ...details] = rawTestCase;
    score = Number(score);

    // Seperate run time and other details included in `details`
    let { time, verdict, msg } = filterDetails(details);

    return { score, time, verdict, msg };
}

/**
 * @typedef {Object} submissionResult
 * @property {String} id Submitter's ID
 * @property {Number} finalScore Submission's final score
 * @property {String} msg Compiling error
 * @property {Array<testCase>} tests Compilation of testCases result
 */

/**
 * Use this function to parse log and return it as an JSON.
 * This is helpful for Wafter because it boost overall load performance,
 * and lower Wafter CPU's Load
 * @param {PathLike} filePath Path to log file that need to be parsed
 * @returns {SubmissionResult} Contains submission result read from log file
 */
async function parseLog(filePath) {
    if (!isFile(filePath)) return null;

    const file_data = await promisify(readFile)(filePath, "utf-8");
    const { id, problem } = logName2Data(basename(filePath));
    return parseLogData(file_data, id, problem);
}

/**
 * This is internal function. Do not touch.
 * @param {String} data log data
 * @param {String} id submission id
 * @param {String} problem problem id
 * @returns {submissionResult}
 */
function parseLogData(data, id, problem) {
    let tests = [];

    const lines = data.split(EOL);

    const header = esr(`${id}‣${problem}`);
    const rVerdict = new RegExp(header + ": (.*)", "i");
    const rScore = new RegExp(header + "‣.+?: (.*)", "i");
    const compileStatus = ["Dịch lỗi!", "Dịch thành công."];

    const border = lines.findIndex((s) => compileStatus.indexOf(s) > -1);

    const findVerdict = lines[0].match(rVerdict);
    let totalScore = Number(findVerdict[1]);
    const msg = lines.slice(3, border).join(EOL);

    // CE (Compiler Error) case
    if (lines[border] === compileStatus[0]) {
        totalScore = null;
    } else {
        const rawTest = lines.slice(border + 2);
        // Convert log into array of testSuite, additionally with score
        const rawTestSuite = rawTest.reduce((chunks, line) => {
            if (rScore.test(line)) {
                // Get score
                chunks.push([rScore.exec(line)[1]]);
            } else {
                // Get other details
                chunks[chunks.length - 1].push(line);
            }
            return chunks;
        }, []);

        tests = rawTestSuite.map(parseTestCase);
    }

    return {
        id,
        totalScore,
        msg,
        tests
    };
}

module.exports = {
    isFile,
    sepName,
    parseLog
};
