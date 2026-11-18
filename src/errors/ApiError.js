class ApiError extends Error {
  constructor(status, title, detail, extra = {}) {
    super(detail);
    this.status = status;
    this.title = title;
    this.extra = extra;
  }
}

module.exports = ApiError;