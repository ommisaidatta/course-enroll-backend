const express = require("express");
const router = express.Router();

const { createCourse } = require("../controllers/admin.createCourse");
const { updateCourse } = require("../controllers/admin.updateCourse");
const { deleteCourse } = require("../controllers/admin.deleteCourse");
const { getAllCourses } = require("../controllers/admin.allCourses");
const { viewAllUsers } = require("../controllers/admin.viewUser");

router.post("/courses", createCourse);

router.put("/courses/:id", updateCourse);

router.delete("/courses/:id", deleteCourse);

router.get("/courses", getAllCourses);

router.get("/users", viewAllUsers);

module.exports = router;
