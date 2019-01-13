import express from "express";

import { formUpload } from "../middleware/upload";
import { validateCode } from "../middleware/validate";
import { submitToThemis } from "../core/submit";

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
    submitToThemis(code, id);

    // Response: 200 OK
    res.sendStatus(200);
});

export default router;
