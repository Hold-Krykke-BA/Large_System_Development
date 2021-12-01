import express from "express";
import { ValidationError } from "../Errors/validationError";
const router = express.Router();
import AttendanceCheckService from "../Services/attendanceCheckService"
import checkIP from "../Util/checkIP";


router.post('/add', async function (req, res, next) {
  try {
    let attendanceCheck = req.body.attendancecheck;
    let seconds = req.body.seconds
    let teacher = req.body.teacher;
    const status = await AttendanceCheckService.addAttendanceCheck(teacher, attendanceCheck, seconds)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

router.get('/all', async function (req: any, res, next) {
  try {
    const attendanceChecks = await AttendanceCheckService.getAllAttendanceChecks();
    res.json(attendanceChecks);
  } catch (err) {
    next(err)
  }
});

router.get('/:code', async function (req: any, res, next) {
  try {
    const code = Number(req.params.code);
    const attendanceCheck = await AttendanceCheckService.getAttendanceCheckByCode(code);
    res.json(attendanceCheck);
  } catch (err) {
    next(err)
  }
});

router.delete('/remove/:attendanceID', async function (req: any, res, next) {
  try {
    const attendanceID = req.params.attendanceID;
    const attendanceCheck = await AttendanceCheckService.deleteAttendanceCheck(attendanceID);
    res.json(attendanceCheck);
  } catch (err) {
    next(err)
  }
});

router.put('/addstudent', async function (req, res, next) {
  try {
    let code: number = Number(req.body.code);
    let studentID: string = req.body.studentID;
    if (await checkIP(req)) {
      const status = await AttendanceCheckService.addStudentToAttendanceCheck(code, studentID)
      res.json({ status })
    }
    else {
      throw new ValidationError('IP not recognised')
    }
  } catch (err) {
    next(err);
  }
})

module.exports = router;