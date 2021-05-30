"use strict";

/**
 * Verdict dictionary.
 * Parser will use this to filter verdict
 * If not matching, by default, parser will use raw verdict
 * Below is logic bits explanation
 * 1st      is output correct?
 * 2nd      is run in time?
 * 3rd      is runnable?
 * 4th      is compilable?
 * Reverse order for future expansion
 */
module.exports = {
    "Kết quả đúng!": 0b1111,
    "Kết quả khớp đáp án!": 0b1111,
    "Kết quả KHÁC đáp án!": 0b0111,
    "Chạy quá thời gian": 0b0011,
    "Chạy sinh lỗi": 0b0001,
    default: 0b0000
};
