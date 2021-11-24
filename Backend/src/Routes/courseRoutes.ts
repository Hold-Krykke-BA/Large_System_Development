import express from "express";
const router = express.Router();
import connection from "../Services/databaseService"
import UserService from "../Services/userService"
import CourseService from "../Services/courseService"
import AttendanceCheckService from "../Services/attendanceCheckService"


// (async function setup() {
//   const client = await connection();
//   await CourseService.setDatabase(client)
// })()

router.post('/', async function (req, res, next) {
  try {
    let newCourse = req.body;
    const status = await CourseService.addCourse(newCourse)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

module.exports = router;