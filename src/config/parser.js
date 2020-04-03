"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * If not matching, by default, parser will use raw verdict
 */
module.exports = {
    "Kết quả khớp đáp án!": "AC",
    "Kết quả KHÁC đáp án!": "WA",
    "Chạy quá thời gian": "TLE",
    "Chạy sinh lỗi": "RTE",
    default: "RTE"
};
