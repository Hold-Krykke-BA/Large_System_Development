import express, { NextFunction, Request } from 'express';
import { AuthorizationError } from '../Errors/AuthorizationError';
import { ValidationError } from '../Errors/validationError';
import IAttendanceCheck from '../Models/IAttendanceCheck';
const router = express.Router();
import AttendanceCheckService from '../Services/attendanceCheckService';
import checkIP from '../Util/checkIP';
import { AuthRequest } from '../Util/Types';

const authIsTeacher = (req: AuthRequest, res: any, next: NextFunction) => {
  if (!req.token?.isTeacher) {
    const err = new AuthorizationError('Unauthorized (1)', 403);
    return next(err);
  } else {
    next();
  }
};

router.post('/add', authIsTeacher, async (req, res, next) => {
  try {
    let attendanceCheck = req.body.attendancecheck;
    let seconds = req.body.seconds;
    let teacher = req.body.teacher;
    const status = await AttendanceCheckService.addAttendanceCheck(teacher, attendanceCheck, seconds);
    res.json({ status });
  } catch (err) {
    next(err);
  }
});

router.get('/all', authIsTeacher, async (req: any, res, next) => {
  try {
    const attendanceChecks = await AttendanceCheckService.getAllAttendanceChecks();
    res.json(attendanceChecks);
  } catch (err) {
    next(err);
  }
});

router.get('/:code', async (req: AuthRequest, res, next) => {
  try {
    const code = Number(req.params.code);
    const attendanceCheck: IAttendanceCheck = await AttendanceCheckService.getAttendanceCheckByCode(code);

    //Check if attendanceCheck belongs to user
    if (!req.token?.isTeacher) {
      const userExists = attendanceCheck.students.find((student) => student.userID === req.token?.userID);
      if (!userExists) {
        const err = new AuthorizationError('Unauthorized (1.5)', 403);
        return next(err);
      }
    }
    res.json(attendanceCheck);
  } catch (err) {
    next(err);
  }
});

router.delete('/remove/:attendanceID', authIsTeacher, async (req: any, res, next) => {
  try {
    const attendanceID = req.params.attendanceID;
    const attendanceCheck = await AttendanceCheckService.deleteAttendanceCheck(attendanceID);
    res.json(attendanceCheck);
  } catch (err) {
    next(err);
  }
});

router.put('/addstudent', async (req, res, next) => {
  try {
    let code: number = Number(req.body.code);
    let studentID: string = req.body.studentID;
    if (await checkIP(req)) {
      const status = await AttendanceCheckService.addStudentToAttendanceCheck(code, studentID);
      res.json({ status });
    } else {
      throw new ValidationError('IP not recognised');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
