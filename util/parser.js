import { readFileSync } from "fs";
import esr from "escape-string-regexp";
import { basename, extname } from "path";
import { EOL } from "os";

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
    const file = readFileSync(filePath, "utf8");
    const lines = file.split(EOL);
    const [user, prob] = logName2Data(basename(filePath));

    const header = esr(`${user}‣${prob}`);
    const rScore = new RegExp(`^${header}‣Test[0-9]{2}: (.*)$`, "im");
    const rTime = new RegExp("^Thời gian ≈ (.+) giây$", "m");

    const findVerdict = lines[0].match(new RegExp(`${header}: (.*)`, "i"));
    const verdict = Number(findVerdict[1]);
    // console.log(lines);
    if (isNaN(verdict)) {
        return {
            id: user,
            problem: prob,
            verdict,
            details: lines.slice(2).join(EOL)
        };
    }

    const rawResult = lines
        .slice(4)
        .reverse()
        .join(EOL)
        .split(rScore)
        .reverse();

    rawResult.shift();

    const testsResult = [];
    while (rawResult.length > 0) {
        let [score, details] = rawResult.splice(0, 2);
        let time = 0;
        details = details.slice(2);
        if (rTime.test(details)) {
            let timeStr = details.split(rTime);
            time = Number(timeStr[1]);
            details = timeStr[0];
        }
        testsResult.push({ score, time, details });
    }

    return {
        id: user,
        problem: prob,
        verdict,
        tests: testsResult
    };
}

// parseLog("test/[BadGuy][LARES].PAS.log").then(result => console.log(result));
console.log(logName2Data("[BadGuy][LARES].PAS.log"));
