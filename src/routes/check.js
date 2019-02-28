"use strict";

const express = require("express");

const router = express.Router();

/**
 * /check - /GET
 * @description Check if server has done handshake.
 */
router.get("/", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
