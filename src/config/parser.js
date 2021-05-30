"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * Below is logic bits explanation
 * 1st      is output correct?
 * 2nd      is run in time?
 * 3rd      is runnable?
 * 4th      is compilable?
 * Reverse order for future expansion
 */
module.exports = {
    "Kết quả đúng!": {
        bit: 0b1111,
        text: "AC",
    },
    "Kết quả khớp đáp án!": {
        bit: 0b1111,
        text: "AC",
    },
    "Kết quả KHÁC đáp án!": {
        bit: 0b0111,
        text: "WA",
    },
    "Chạy quá thời gian": {
        bit: 0b0011,
        text: "TLE",
    },
    "Chạy sinh lỗi": {
        bit: 0b0001,
        text: "RTE",
    },
    default: {
        bit: 0b0000,
        text: "Unknown",
    },
};
