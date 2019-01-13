import express from "express";
import { getQueue } from "../util/queue";

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

export { router as queue };
