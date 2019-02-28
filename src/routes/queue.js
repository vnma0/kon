"use strict";

const express = require("express");
const { getQueue } = require("../util/queue");

const router = express.Router();

/**
 * /queue - /GET
 * @description Get number of task(s) in queue
 */
router.get("/", (req, res) => {
    try {
        let num = getQueue();
        res.send(String(num));
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
