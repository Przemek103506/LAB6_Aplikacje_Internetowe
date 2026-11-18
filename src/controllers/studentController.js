const studentRepository = require("../repositories/mysql/studentRepository");
const enrollmentRepository = require("../repositories/mysql/enrollmentRepository");
const { toStudent } = require("../mappers/studentMapper");
const ApiError = require("../errors/ApiError");

function parseListQuery(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const sortBy = typeof query.sort === "string" ? query.sort : undefined;
  const order = query.order === "desc" ? "desc" : "asc";
  const city =
    typeof query.city === "string" && query.city.trim() !== ""
      ? query.city.trim()
      : undefined;
  const fieldOfStudy =
    typeof query.fieldOfStudy === "string" && query.fieldOfStudy.trim() !== ""
      ? query.fieldOfStudy.trim()
      : undefined;

  return {
    page,
    limit,
    sortBy,
    order,
    city,
    fieldOfStudy
  };
}

async function getAll(req, res, next) {
  try {
    const params = parseListQuery(req.query);
    const result = await studentRepository.findAll(params);
    res.json({
      ...result,
      items: result.items.map(toStudent)
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const row = await studentRepository.findById(req.params.id);
    if (!row) {
      throw new ApiError(404, "Not Found", "Student o podanym identyfikatorze nie istnieje.");
    }
    res.json(toStudent(row));
  } catch (err) {
    next(err);
  }
}

async function getStudentCourses(req, res, next) {
  try {
    const student = await studentRepository.findById(req.params.id);
    if (!student) {
      throw new ApiError(404, "Not Found", "Student o podanym identyfikatorze nie istnieje.");
    }
    const courses = await enrollmentRepository.findCoursesByStudent(req.params.id);
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const row = await studentRepository.create(req.body);
    res.status(201).json(toStudent(row));
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await studentRepository.update(req.params.id, req.body);
    if (!updated) {
      throw new ApiError(404, "Not Found", "Student o podanym identyfikatorze nie istnieje.");
    }
    const row = await studentRepository.findById(req.params.id);
    res.json(toStudent(row));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await studentRepository.remove(req.params.id);
    if (!deleted) {
      throw new ApiError(404, "Not Found", "Student o podanym identyfikatorze nie istnieje.");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  getStudentCourses,
  create,
  update,
  remove
};