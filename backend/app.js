const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const auth = require("./routes/auth");
const element = require("./routes/element");

const errorMiddleware = require("./middlewares/errors");
app.use(express.json({ limit: "100mb" }));
// app.set("trust proxy", 1);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/v1", auth);
app.use("/api/v1", element);

app.use(errorMiddleware);
module.exports = app;
