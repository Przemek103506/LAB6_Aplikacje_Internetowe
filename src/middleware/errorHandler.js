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

function mapDbError(err) {
  if (err.code === "ER_DUP_ENTRY" || err.errno === 1062) {
    return {
      status: 409,
      title: "Conflict",
      detail: "Rekord o podanej wartości już istnieje."
    };
  }

  const unavailable = ["ECONNREFUSED", "ETIMEDOUT", "PROTOCOL_CONNECTION_LOST"];
  if (unavailable.includes(err.code)) {
    return {
      status: 503,
      title: "Service Unavailable",
      detail: "Baza danych jest chwilowo niedostępna."
    };
  }

  return null;
}

function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).type("application/problem+json").json({
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "Niepoprawny format JSON",
      instance: req.originalUrl
    });
  }

  const mapped = mapDbError(err);
  const status = mapped?.status ?? err.status ?? 500;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).type("application/problem+json").json({
    type: "about:blank",
    title: mapped?.title ?? err.title ?? "Internal Server Error",
    status,
    detail:
      mapped?.detail ??
      (status === 500 ? "Wystąpił nieoczekiwany błąd." : err.message),
    instance: req.originalUrl,
    ...err.extra
  });
}

module.exports = errorHandler;