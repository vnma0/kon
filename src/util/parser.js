"use strict";

const { readFile, lstatSync } = require("fs");
const esr = require("escape-string-regexp");
const { basename, extname } = require("path");
const { promisify } = require("util");

const verdicts = require("../config/parser");

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

/**
 * Push array to this function to chunk array into array of subarrays.
 * It is helpful especially when array need to be divided in sections.
 * This one was written due to native preference.
 * @param {Array} array
 * @param {Number} chunkSize
 */
function chunkArray(array, chunkSize) {
    var results = [];
    while (array.length) results.push(array.splice(0, chunkSize));

    return results;
}

const EOL = "\r\n";

/**
 * @typedef {Object} testAndTime
 * @property {String} test A test case without time string
 * @property {Number} time Extracted time from test case
 */

/**
 * Call this function to seperate time and test.
 * The function was refactored from parseTestCase,
 * in order to keep the code clean.
 * @param {String} test Test's details line
 * @param {Number} time Pass by reference
 * @returns {testAndTime} Extracted test and time from test case
 */
function filterTestTime(test, time) {
    const rTime = new RegExp("^Thời gian ≈ (.+) giây" + esr(EOL), "m");
    if (rTime.test(test)) {
        let timeStr = test.split(rTime).filter((s) => s !== "");
        // Set `time` to time
        time = Number(timeStr[0]);
        // Remove timeStr from `details`
        test = timeStr[1];
    }
    return { test, time };
}

/**
 * @typedef {Object} parsedTestVerdict
 * @property {String} verdict Final test case verdict
 * @property {String} details Further details from test case
 */

/**
 * Call this function to parse rawDeatails into verdicts and details.
 * Cause exceptional test case contains verdict and details after time and result.
 * @param {Array} rawDetails raw extraction from test case in log file
 * @returns {parsedTestVerdict} Verdicts and details from a test case
 */
function parseTestVerdict(rawDetails) {
    // Filter Exit code
    const rExitCode = new RegExp(esr("(Hexadecimal: ") + "(.+)" + esr(")"));

    const verdict = verdicts[rawDetails[0]] || rawDetails[0];
    const details = rExitCode.test(rawDetails[1])
        ? "Exit code: " + rawDetails[1].match(rExitCode)[1]
        : rawDetails[1] || undefined;

    return { verdict, details };
}

/**
 * @typedef {Object} parsedTestCase
 * @property {String} score Final testCase score
 * @property {String} time testCase time
 * @property {String} verdict Final testCase verdict
 * @property {String} [details] Optional testCase details
 */

/**
 * Use this function to parse rawTestCase into parsedTestCase object.
 * The whole log file is divided into testCases, and parseTestCase is used
 * in order to retrieve acutal result from Themis.
 * @param {Array} rawTestCase raw extraction of testCase from log file
 * @returns {parsedTestCase} Parsed test case from rawTestCase
 */
function parseTestCase(rawTestCase) {
    let [score, test] = rawTestCase;
    score = Number(score);
    let time = 0;
    // Skip unused EOL chararcter
    test = test.slice(EOL.length);
    // In case run time is included in `details`
    ({ test, time } = filterTestTime(test, time));

    // Parse verdict and details if there is
    const verdict = parseTestVerdict(test.split(EOL));

    // if (details) return { score, time, verdict, details };
    // else return { score, time, verdict };
    return { score, time, ...verdict };
}

/**
 * @typedef {Object} submissionResult
 * @property {String} id Submitter's ID
 * @property {String} problem Submission's problem
 * @property {Number} finalScore Submission's final score
 * @property {String} [details] Compiling error
 * @property {Array<parsedTestCase>} [tests] Compilation of testCases result
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

    const file = await promisify(readFile)(filePath, "utf-8");
    const { id, problem } = logName2Data(basename(filePath));

    const lines = file.split(EOL);

    const header = esr(`${id}‣${problem}`);
    const rVerdict = new RegExp(header + ": (.*)", "i");
    const rScore = new RegExp(header + "‣(.+?): (.*)", "i");

    const findVerdict = lines[0].match(rVerdict);
    const finalScore = Number(findVerdict[1]);

    // CE (Compiler Error) case
    if (isNaN(finalScore))
        return {
            id,
            problem,
            finalScore,
            details: lines.slice(3).join(EOL)
        };

    // Convert log into array of testSuite, additionally with score
    const rawTestSuite = chunkArray(
        lines
            .slice(4)
            .join(EOL)
            .split(rScore)
            .filter((s) => s),
        2
    );

    const parsedTestSuite = rawTestSuite.map(parseTestCase);

    return {
        id,
        problem,
        finalScore,
        tests: parsedTestSuite
    };
}

module.exports = {
    isFile,
    sepName,
    parseLog
};
