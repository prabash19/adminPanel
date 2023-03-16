const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");
const ErrorHandler = require("./utils/errorHandler");
dotenv.config({ path: "./config.env" });

const client = require("./routes/clientRoutes");
const general = require("./routes/generalRoutes");
const management = require("./routes/managementRoutes");
const sales = require("./routes/salesRoutes");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
connectDB(DB);
async function connectDB(DB) {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.log("DB error: ", err);
  }
}

app.use("/client", client);
app.use("/general", general);
app.use("/management", management);
app.use("/sales", sales);

// Error handler for invalid routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler("Cannot find requested route", 404));
});

app.use(errorMiddleware);

module.exports = app;
