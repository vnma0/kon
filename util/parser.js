import { readFile, lstatSync } from "fs";
import esr from "escape-string-regexp";
import { basename, extname } from "path";
import { promisify } from "util";

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
        .filter(s => s !== "")
        .slice(0, 2);

    return data;
}

/**
 * Parse log and return as an Object
 * @param {PathLike} filePath Path to log file
 * @returns {Object} Contains submission result
 */
export async function parseLog(filePath) {
    if (!isFile(filePath)) return null;

    const EOL = "\r\n";
    const readFileAsync = promisify(readFile);
    const file = await readFileAsync(filePath, "utf8");
    const lines = file.split(EOL);
    const [user, prob] = logName2Data(basename(filePath));

    const header = esr(`${user}‣${prob}`);
    const rScore = new RegExp(`^${header}‣Test[0-9]{2}: (.*)$`, "im");
    const rTime = new RegExp("^Thời gian ≈ (.+) giây" + esr(EOL), "m");
    const rExitCode = new RegExp(esr("(Hexadecimal: ") + "(.+)" + esr(")"));

    const findVerdict = lines[0].match(new RegExp(`${header}: (.*)`, "i"));
    const finalScore = Number(findVerdict[1]);

    if (isNaN(finalScore)) {
        return {
            id: user,
            problem: prob,
            finalScore,
            details: lines.slice(3).join(EOL)
        };
    }

    // Magic
    // Reverse log file then split it using rScore regex
    // After that, reverse again to receive array of testResult
    const rawResult = lines
        .slice(4)
        .join(EOL)
        .split(rScore);

    rawResult.shift();

    const testsResult = [];
    while (rawResult.length > 0) {
        let [score, test] = rawResult.splice(0, 2);
        score = Number(score);
        let time = 0;
        // Skip unused EOL chararcter
        test = test.slice(EOL.length);
        let verdict = null;
        let details = null;
        // In case run time is included in `details`
        if (rTime.test(test)) {
            let timeStr = test.split(rTime).filter(s => s !== "");
            // Set `time` to time
            time = Number(timeStr[0]);
            // Remove timeStr from `details`

            test = timeStr[1];
        }

        test = test.split(EOL);

        switch (test[0]) {
            case "Kết quả khớp đáp án!":
                verdict = "AC";
                break;
            case "Kết quả KHÁC đáp án!":
                verdict = "WA";
                break;
            case "Chạy quá thời gian":
                verdict = "TLE";
                break;
            case "Chạy sinh lỗi":
                verdict = "RTE";
                details = "Exit code: " + test[1].match(rExitCode)[1];
                break;
        }
        if (details) testsResult.push({ score, time, verdict, details });
        else testsResult.push({ score, time, verdict });
    }

    return {
        id: user,
        problem: prob,
        finalScore,
        tests: testsResult
    };
}

export function isFile(filePath) {
    const stat = lstatSync(filePath);
    return stat.isFile();
}
