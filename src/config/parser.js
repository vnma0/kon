"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * If not matching, by default, parser will use raw verdict
 * Below is logic bits explanation
 * 1st      is runnable ?
 * 2nd      is run in time ?
 * 3rd      is output correct ?
 */
module.exports = {
    "Kết quả đúng!": 0b111,
    "Kết quả khớp đáp án!": 0b111,
    "Kết quả KHÁC đáp án!": 0b110,
    "Chạy quá thời gian": 0b100,
    "Chạy sinh lỗi": 0b000,
    default: 0b000
};
