const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./errors/ApiError");

const app = express();

app.use(express.json());

const v1 = express.Router();
v1.use("/students", studentRoutes);

app.use("/api/v1", v1);

app.use((req, res, next) => {
  next(new ApiError(404, "Not Found", "Nie znaleziono zasobu pod wskazanym adresem."));
});

app.use(errorHandler);

module.exports = app;