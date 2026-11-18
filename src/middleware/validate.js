const { validationResult } = require("express-validator");
const ApiError = require("../errors/ApiError");

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((e) =>
    e.type === "unknown_fields"
      ? {
          field: e.fields.map((f) => f.path).join(","),
          message: "Pole spoza kontraktu API"
        }
      : { field: e.path, message: e.msg }
  );

  next(
    new ApiError(400, "Bad Request", "Niepoprawne dane wejściowe.", { errors })
  );
}

module.exports = validate;