const express = require("express");

const Status = require("../core/status");
const extractTasks = require("../core/setup");
const { taskUpload } = require("../middleware/upload");
const { checkInitial, validateTask } = require("../middleware/validate");

const router = express.Router();

/**
 * /task - /POST
 * @description Recieve task from Wafter. This route run for once only
 */
router.post("/", checkInitial, taskUpload, validateTask, (req, res) => {
    const taskZipPath = req.file.path;
    extractTasks(taskZipPath).then((err) => {
        if (err) res.sendStatus(500);
        else {
            Status.setReady(req.ip);
            res.sendStatus(200);
        }
    });
});

module.exports = router;
