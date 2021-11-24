import express from "express";
const router = express.Router();
import connection from "../Services/databaseService"
import UserService from "../Services/userService"
import CourseService from "../Services/courseService"
import AttendanceCheckService from "../Services/attendanceCheckService"

router.post('/', async function (req, res, next) {
  try {
    let newAttendanceCheck = req.body;
    const status = await AttendanceCheckService.addAttendanceCheck(newAttendanceCheck)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

module.exports = router;