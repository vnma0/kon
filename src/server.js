const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const Console = require("console");
const ip = require("ip");

const server = require("./config/server");

const task = require("./routes/task");
const check = require("./routes/check");
const get = require("./routes/get");
const submit = require("./routes/submit");
const queue = require("./routes/queue");

const { cleanTemp } = require("./util/clean");
const { checkStatus } = require("./middleware/validate");

const ON_DEATH = require("death");

const app = express();

app.use(helmet());
// Safety first
if (server.logRequest) app.use(morgan("tiny"));

// Routing
app.use("/task", task);

app.all("/", (req, res) => {
    res.sendStatus(418);
});

app.use(checkStatus);
app.use("/check", check);
app.use("/submit", submit);
app.use("/get", get);
app.use("/queue", queue);
app.all("/*", (req, res) => {
    res.sendStatus(404);
});

/**
 * Start server
 * @description This will start listen at port PORT
 */
let listener = app.listen(server.PORT, () => {
    // TODO: clean everything before start and prepare directory
    cleanTemp();
    // Verbose

    Console.log(
        `Kon is listening at http://${ip.address()}:${listener.address().port}`
    );
});

ON_DEATH(() => {
    listener.close(() => {
        Console.log("Shutting down Kon");
    });
});
