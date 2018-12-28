import express from "express";
import { address } from "ip";
import helmet from "helmet";
import morgan from "morgan";

import { task } from "./routes/task";
import { check } from "./routes/check";
import { get } from "./routes/get";
import { submit } from "./routes/submit";

import { cleanTemp } from "./util/clean";

const app = express();

const PORT = 30000;

app.use(helmet());
// Safety first
app.use(morgan("tiny"));

// Routing
app.use("/task", task);
app.use("/check", check);
app.use("/submit", submit);
app.use("/get", get);

/**
 * Start server
 * @description This will start listen at port PORT
 */
app.listen(PORT, () => {
    // TODO: clean everything before start and prepare directory
    cleanTemp();
    // Verbose
    console.log(`Server is listening on ${address()} at ${PORT}`);
});

// TODO: clean code
