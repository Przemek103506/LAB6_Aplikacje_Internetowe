const pool = require("../../db/mysql");

async function findCoursesByStudent(studentId) {
  const [rows] = await pool.execute(
    `SELECT
       c.id AS courseId,
       c.code,
       c.name,
       c.ects,
       e.grade,
       e.enrolled_at AS enrolledAt
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.student_id = ?
     ORDER BY c.name ASC`,
    [studentId]
  );
  return rows;
}

module.exports = {
  findCoursesByStudent
};