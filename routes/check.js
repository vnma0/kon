import express from "express";

import { checkStatus } from "../middleware/validate";

const router = express.Router();

/**
 * /check - /GET
 * @description Check if server has done handshake.
 */
router.get("/", checkStatus, (req, res) => {
    res.sendStatus(200);
});

export { router as check };
