import express from "express";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import IUser from "../Models/IUser";
const router = express.Router();
import AttendanceCheckService from "../Services/attendanceCheckService"




router.post('/add', async function (req, res, next) {
  try {
    let attendanceCheck = req.body.attendancecheck;
    let seconds = req.body.seconds
    const status = await AttendanceCheckService.addAttendanceCheck(attendanceCheck, seconds)
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
    const status = await AttendanceCheckService.addStudentToAttendanceCheck(code, studentID)
    res.json({ status })
  } catch (err) {
    next(err);
  }
})

module.exports = router;