import express from "express";

const router = express.Router();

/**
 * /check - /GET
 * @description Check if server has done handshake.
 */
router.get("/", (req, res) => {
    res.sendStatus(200);
});

export { router as check };
