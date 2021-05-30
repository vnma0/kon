"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * Below is logic bits explanation
 * 1st      have correct output?
 * 2nd      can run in time?
 * 3rd      can run?
 * 4th      can compile?
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
        text: "CE",
    },
};
