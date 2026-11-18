function errorHandler(err, req, res, next) {
  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    return res.status(409).json({ error: "Student z podanym adresem e-mail już istnieje" });
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({
    error: status === 500 ? "Internal Server Error" : err.message
  });
}

module.exports = errorHandler;