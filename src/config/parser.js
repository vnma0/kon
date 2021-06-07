"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * Below is logic bits explanation
 * 1st      have output problem?
 * 2nd      run out of time?
 * 3rd      runtime error?
 * Reverse order for future expansion
 */
module.exports = {
    "Kết quả đúng!": {
        bit: 0b000,
        text: "AC",
    },
    "Kết quả khớp đáp án!": {
        bit: 0b000,
        text: "AC",
    },
    "Kết quả KHÁC đáp án!": {
        bit: 0b100,
        text: "WA",
    },
    "Chạy quá thời gian": {
        bit: 0b010,
        text: "TLE",
    },
    "Chạy sinh lỗi": {
        bit: 0b001,
        text: "RTE",
    },
    default: {
        bit: -1,
        text: "Unknown Error",
    },
};
