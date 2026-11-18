const router = require("express").Router();
const { body, param } = require("express-validator");
const controller = require("../controllers/studentController");
const validate = require("../middleware/validate");

const idRule = param("id")
  .isInt({ min: 1 })
  .withMessage("Identyfikator musi być dodatnią liczbą całkowitą")
  .toInt();

const studentRules = [
  body("fullName")
    .trim()
    .isLength({ min: 3, max: 120 })
    .withMessage("Imię i nazwisko: od 3 do 120 znaków"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Niepoprawny adres e-mail"),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("Miasto jest wymagane"),
  body("fieldOfStudy")
    .trim()
    .notEmpty()
    .withMessage("Kierunek jest wymagany"),
  body("year")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rok musi należeć do zakresu 1-5")
    .toInt(),
  body("active")
    .optional()
    .isBoolean()
    .withMessage("Pole active musi być wartością logiczną")
    .toBoolean()
];

router.get("/", controller.getAll);
router.get("/:id", idRule, validate, controller.getById);
router.get("/:id/courses", idRule, validate, controller.getStudentCourses);
router.post("/", studentRules, validate, controller.create);
router.put("/:id", idRule, studentRules, validate, controller.update);
router.delete("/:id", idRule, validate, controller.remove);

module.exports = router;