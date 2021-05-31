"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * Below is logic bits explanation
 * 1st      have output problem?
 * 2nd      run out of time?
 * 3rd      runtime error?
 * 4th      critical error?
 * Reverse order for future expansion
 */
module.exports = {
    "Kết quả đúng!": {
        bit: 0b0000,
        text: "AC",
    },
    "Kết quả khớp đáp án!": {
        bit: 0b0000,
        text: "AC",
    },
    "Kết quả KHÁC đáp án!": {
        bit: 0b1000,
        text: "WA",
    },
    "Chạy quá thời gian": {
        bit: 0b1100,
        text: "TLE",
    },
    "Chạy sinh lỗi": {
        bit: 0b1110,
        text: "RTE",
    },
    default: {
        bit: -1,
        text: "Critical Error",
    },
};
