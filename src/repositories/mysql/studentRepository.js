const pool = require("../../db/mysql");

const SORT = {
  fullName: "full_name",
  city: "city",
  year: "year",
  createdAt: "created_at"
};

async function findAll({ city, fieldOfStudy, page = 1, limit = 10, sortBy, order = "asc" } = {}) {
  const conditions = [];
  const params = [];

  if (city) {
    conditions.push("city = ?");
    params.push(city);
  }

  if (fieldOfStudy) {
    conditions.push("field_of_study = ?");
    params.push(fieldOfStudy);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sortColumn = SORT[sortBy] || "full_name";
  const sortOrder = order === "desc" ? "DESC" : "ASC";
  const offset = (page - 1) * limit;

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM students ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT id, full_name, email, city, field_of_study, year, active, created_at
     FROM students
     ${whereClause}
     ORDER BY ${sortColumn} ${sortOrder}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  return {
    items: rows,
    page: Number(page),
    limit: Number(limit),
    total,
    pages: Math.ceil(total / limit) || 0
  };
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, full_name, email, city, field_of_study, year, active, created_at
     FROM students
     WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

async function create({ fullName, email, city, fieldOfStudy, year, active = true }) {
  const [result] = await pool.execute(
    `INSERT INTO students (full_name, email, city, field_of_study, year, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fullName, email, city, fieldOfStudy, year, active]
  );
  return findById(result.insertId);
}

async function update(id, { fullName, email, city, fieldOfStudy, year, active = true }) {
  const [result] = await pool.execute(
    `UPDATE students
     SET full_name = ?, email = ?, city = ?, field_of_study = ?, year = ?, active = ?
     WHERE id = ?`,
    [fullName, email, city, fieldOfStudy, year, active, id]
  );
  return result.affectedRows === 1;
}

async function remove(id) {
  const [result] = await pool.execute(
    `DELETE FROM students WHERE id = ?`,
    [id]
  );
  return result.affectedRows === 1;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};