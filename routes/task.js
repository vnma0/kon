import express from "express";

import Status from "../core/status";
import { extractTasks } from "../core/setup";
import { taskUpload } from "../middleware/upload";
import { checkInitial, validateTask } from "../middleware/validate";

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
            Status.setReady();
            res.sendStatus(200);
        }
    });
});

export { router as task };
