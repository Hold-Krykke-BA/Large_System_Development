const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import IUser from "../Models/IUser";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import ICourse from "../Models/ICourse";
import connection from "./databaseService"
import UserService from "../Services/userService"
import CourseService from "../Services/courseService"
import ICode from "../Models/ICode";

let attendanceCheckCollection: mongo.Collection;
let codeCollection: mongo.Collection;
let EXPIRES_AFTER = 600;

export default class AttendanceCheckService {
  static async setDatabase(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      await client.connect();
      attendanceCheckCollection = client.db(dbName).collection("attendanceChecks");
      codeCollection = client.db(dbName).collection("codes");
      await attendanceCheckCollection.createIndex({ attendanceCheckID: 1 }, { unique: true })
      await codeCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: EXPIRES_AFTER })
      return client.db(dbName);

    } catch (err) {
      console.error("Could not create connect", err)
    }
  }

  static async addAttendanceCheck(attendanceCheck: IAttendanceCheck): Promise<any> {
    await AttendanceCheckService.addCode(attendanceCheck.attendanceCheckCode);
    let _code = await AttendanceCheckService.getCode(attendanceCheck.attendanceCheckCode.code)
    let newAttendanceCheck = { ...attendanceCheck, attendanceCheckCode: _code }
    try {
      return await attendanceCheckCollection.insertOne(newAttendanceCheck);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  static async getAttendanceCheckByCode(code: number, proj?: object): Promise<any> {
    const _code = await attendanceCheckCollection.findOne(
      { 'attendanceCheckCode.code': code },
      proj
    )
    if (!_code) {
      throw new Error("AttendanceCheck not found");
    }
    return _code;
  }

  private static async getCode(code: number, proj?: object): Promise<any> {
    const _code = await codeCollection.findOne(
      { code },
      proj
    )
    if (!_code) {
      throw new Error("Code not found");
    }
    return _code;
  }

  static async addStudentToAttendanceCheck(attendanceCheck: IAttendanceCheck, student: IUser): Promise<IAttendanceCheck> {
    let _attendanceCheck = await AttendanceCheckService.getAttendanceCheckByCode(attendanceCheck.attendanceCheckCode.code)
    let checkStudent = _attendanceCheck.students.filter((s: { userID: string; }) => s.userID === student.userID)
    if (checkStudent.length) { }///// continue here check if student is in list/if list have any elements
    attendanceCheck.students.filter(s => s.userID === student.userID)
    let _code = await AttendanceCheckService.getCode(attendanceCheck.attendanceCheckCode.code)
    if (_code.code) {
      _attendanceCheck.students.push(student)
      attendanceCheckCollection.updateOne(
        { attendanceCheckID: _attendanceCheck.attendanceCheckID },
        {
          $set: { 'students': _attendanceCheck.students }
        }
      );
    }
    return attendanceCheck;
  }


  private static async addCode(code: ICode): Promise<any> {
    let newCode = { ...code, createdAt: new Date() }
    try {
      return await codeCollection.insertOne(newCode);
    } catch (err: any) {
      console.error(err.message);
    }
  }
}

async function test() {
  console.log('"testing"')
  const client = await connection();
  await AttendanceCheckService.setDatabase(client)
  let _course = await CourseService.getCourse('sou-si-21');
  let _code: ICode = { code: 123456, createdAt: new Date() }
  //await AttendanceCheckService.addAttendanceCheck({ attendanceCheckID: "w1", courseID: _course.courseID, students: _course.students, attendanceCheckCode: _code });
  await AttendanceCheckService.addAttendanceCheck({ attendanceCheckID: "w2", courseID: _course.courseID, students: [], attendanceCheckCode: _code });
  let getCheck = await AttendanceCheckService.getAttendanceCheckByCode(_code.code);
  console.log(getCheck)
  let getStudent = await UserService.getUser('cs340@cphbusiness.dk')
  let getStudent2 = await UserService.getUser('rn118@cphbusiness.dk')
  await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent)
  await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent)
  await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent2)
}
test();
