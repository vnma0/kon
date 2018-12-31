import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { logRequest, taskRequired, PORT } from "./config/server";

import { task } from "./routes/task";
import { check } from "./routes/check";
import { get } from "./routes/get";
import { submit } from "./routes/submit";

import Status from "./core/status";
import { cleanTemp } from "./util/clean";
import { queue } from "./routes/queue";

const app = express();

app.use(helmet());
// Safety first
if (logRequest) app.use(morgan("tiny"));

// Routing
if (taskRequired) app.use("/task", task);
else Status.setReady();

app.use("/check", check);
app.use("/submit", submit);
app.use("/get", get);
app.use("/queue", queue);

/**
 * Start server
 * @description This will start listen at port PORT
 */
app.listen(PORT, () => {
    // TODO: clean everything before start and prepare directory
    cleanTemp();
    // Verbose
    console.log(`Server is listening at ${PORT}`);
});

// TODO: clean code
