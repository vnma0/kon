import { readFile, lstatSync } from "fs";
import esr from "escape-string-regexp";
import { basename, extname } from "path";
import { promisify } from "util";

/**
 * Check if given filePath is a File in filesystem
 * @param {PathLike} filePath A path string
 * @return {Boolean} True if it is, else vice versa
 */
export function isFile(filePath) {
    const stat = lstatSync(filePath);
    return stat.isFile();
}

/**
 * Convert filename to tuple of base and extension
 * @param {PathLike} filename Path to filename
 * @returns {Tuple} base, ext
 */
export function sepName(filename) {
    const ext = extname(filename);
    const base = basename(filename, ext);
    return [base, ext];
}

/**
 * Turn file name into name and problem name
 * @param {String} filename
 */
function logName2Data(filename) {
    // TODO: Sanitize filename
    const data = filename
        .split(/\[(.+?)\]/)
        .filter((s) => s !== "")
        .slice(0, 2);

    return data;
}

/**
 * Chunk array into array of subarrays
 * @param {Array} array
 * @param {Number} chunk_size
 */
function chunkArray(array, chunk_size) {
    var results = [];

    while (array.length) {
        results.push(array.splice(0, chunk_size));
    }

    return results;
}

const EOL = "\r\n";

/**
 * Filter time from test
 * ({ test, time } = filterTestTime(test, time));
 * @param {String} test Test's details line
 * @param {Number} time Pass by reference
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
 * Parse rawDeatails into verdicts and details
 * @param {Array} rawDetails
 * @returns verdicts and details
 */
function parseTestVerdict(rawDetails) {
    // Filter Exit code
    const rExitCode = new RegExp(esr("(Hexadecimal: ") + "(.+)" + esr(")"));

    // TODO: Add "Chạy quá bộ nhớ"
    const verdicts = {
        "Kết quả khớp đáp án!": "AC",
        "Kết quả KHÁC đáp án!": "WA",
        "Chạy quá thời gian": "TLE",
        "Chạy sinh lỗi": "RTE"
    };

    const verdict = verdicts[rawDetails[0]] || null;
    const details =
        verdict === "RTE"
            ? "Exit code: " + rawDetails[1].match(rExitCode)[1]
            : null;

    return { verdict, details };
}

/**
 * Parse rawTestCase into testCase object
 * @param {Array} rawTestCase
 * @returns parsedTestCase
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
    const { verdict, details } = parseTestVerdict(test.split(EOL));

    if (details) return { score, time, verdict, details };
    else return { score, time, verdict };
}

/**
 * Parse log and return as an Object
 * @param {PathLike} filePath Path to log file
 * @returns {Object} Contains submission result
 */
export async function parseLog(filePath) {
    if (!isFile(filePath)) return null;

    const file = await promisify(readFile)(filePath, "utf8");
    const [user, prob] = logName2Data(basename(filePath));

    const lines = file.split(EOL);

    const header = esr(`${user}‣${prob}`);
    const rVerdict = new RegExp(header + ": (.*)", "i");
    const rScore = new RegExp(header + "‣Test[0-9]{2}: (.*)", "i");

    const findVerdict = lines[0].match(rVerdict);
    const finalScore = Number(findVerdict[1]);

    // CE (Compiler Error) case
    if (isNaN(finalScore)) {
        return {
            id: user,
            problem: prob,
            finalScore,
            details: lines.slice(3).join(EOL)
        };
    }

    // Convert log into array of testSuite, additionally with score
    const rawTestSuite = chunkArray(
        lines
            .slice(4)
            .join(EOL)
            .split(rScore)
            .filter((s) => s),
        2
    );

    return {
        id: user,
        problem: prob,
        finalScore,
        tests: rawTestSuite.map(parseTestCase)
    };
}
