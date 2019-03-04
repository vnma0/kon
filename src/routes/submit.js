"use strict";

const express = require("express");

const { formUpload } = require("../middleware/upload");
const { validateCode } = require("../middleware/validate");
const submitToThemis = require("../core/submit");

const router = express.Router();

/**
 * /submit - /POST
 * @description Receive source code from Wafter and then move it to Themis
 */
router.post("/", formUpload, validateCode, (req, res) => {
    const code = req.files.code[0];
    const id = req.body.id;

    // Verify id
    if (!id) {
        // Response: 400 Bad Request
        res.sendStatus(400);
        return;
    }
    submitToThemis(code, id).then(
        () => {
            res.sendStatus(200);
        },
        () => {
            res.sendStatus(500);
        }
    );

    // Response: 200 OK
});

module.exports = router;
