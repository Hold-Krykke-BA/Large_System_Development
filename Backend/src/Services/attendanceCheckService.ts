const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import { ValidationError } from "../Errors/validationError";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import ICode from "../Models/ICode";
import CourseService from "./courseService";
import UserService from "./userService";
import newCode from "../Util/generateCode";
import IUser from "../Models/IUser";

let attendanceCheckCollection: mongo.Collection;
let codeCollection: mongo.Collection;
let EXPIRES_AFTER = 600;

export default class AttendanceCheckService {
  static async setDatabase(client: mongo.MongoClient) {
    console.log("in attendanceservice")
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

  static async addAttendanceCheck(teacher: IUser, attendanceCheck: IAttendanceCheck, seconds?: number): Promise<any> {
    AttendanceCheckService.setCodeTTL(seconds)
    let generatedCode = await AttendanceCheckService.addCode(teacher.userID);
    let _code = await AttendanceCheckService.getCode(generatedCode.code)
    let newAttendanceCheck = { ...attendanceCheck, attendanceCheckCode: _code }
    try {
      await attendanceCheckCollection.insertOne(newAttendanceCheck);
      let attendanceCheckWithDbID = await AttendanceCheckService.getAttendanceCheckByID(newAttendanceCheck.attendanceCheckID)
      await CourseService.addAttendanceCheckToCourse(attendanceCheckWithDbID)
      return attendanceCheckWithDbID
    } catch (err: any) {
      console.error(err.message);
    }
  }

  private static async getAttendanceCheckByID(attendanceCheckID: string, proj?: object): Promise<any> {
    const course = await attendanceCheckCollection.findOne(
      { attendanceCheckID },
      proj
    )
    if (!course) {
      throw new Error("AttendanceCheck not found");
    }
    return course;
  }

  static async getAllAttendanceChecks(proj?: object): Promise<Array<any>> {
    const all = attendanceCheckCollection.find(
      {}, { projection: proj }
    )
    return all.toArray();
  }

  static async deleteAttendanceCheck(attendanceCheckID: string): Promise<string> {
    const status = await attendanceCheckCollection.deleteOne({ attendanceCheckID })
    if (status.deletedCount === 1) {
      return "Attendance check was deleted";
    }
    else throw new Error("Requested delete could not be performed")
  }

  static async getAttendanceCheckByCode(code: number, proj?: object): Promise<any> {
    const attendanceCheck = await attendanceCheckCollection.findOne(
      { 'attendanceCheckCode.code': code }, proj)
    if (!attendanceCheck) {
      throw new Error("AttendanceCheck not found");
    }
    return attendanceCheck;
  }

  private static async getCode(code: number, proj?: object): Promise<any> {
    const _code = await codeCollection.findOne(
      { code }, proj)
    if (!_code) {
      throw new ValidationError("Code not valid");
    }
    return _code;
  }

  private static async setCodeTTL(seconds?: number): Promise<void> {
    console.log("setCodeTTL")
    if (seconds && seconds !== EXPIRES_AFTER) {
      EXPIRES_AFTER = seconds
    }
    else {
      EXPIRES_AFTER = 600
    }
    await codeCollection.dropIndex("createdAt_1");
    await codeCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: EXPIRES_AFTER })
  }

  static async addStudentToAttendanceCheck(code: number, studentID: string): Promise<IAttendanceCheck> {
    let attendanceCheck = await AttendanceCheckService.getAttendanceCheckByCode(code)
    let checkStudent = attendanceCheck.students.filter((_student: { userID: string; }) => _student.userID === studentID)
    if (checkStudent.length) {
      return attendanceCheck
    }

    let _code = await AttendanceCheckService.getCode(code)
    if (_code.code) {
      let student = await UserService.getUser(studentID);
      attendanceCheck.students.push(student)
      await attendanceCheckCollection.updateOne(
        { attendanceCheckID: attendanceCheck.attendanceCheckID }, { $set: { 'students': attendanceCheck.students } }
      );
      await CourseService.addAttendanceCheckToCourse(attendanceCheck)
    }
    return attendanceCheck;
  }

  private static async addCode(teacherID: string): Promise<any> {
    let generatedCode = await newCode(teacherID)
    let newcode: ICode = { code: generatedCode, createdAt: new Date() }
    try {
      await codeCollection.insertOne(newcode);
      return newcode
    } catch (err: any) {
      console.error(err.message);
    }
  }
}

// import connection from './databaseService'
// import CourseService from "./courseService";
// import UserService from "./userService";
// async function test() {
//   console.log('"testing"')
//   const client = await connection();
//   await AttendanceCheckService.setDatabase(client)
  // let _course = await CourseService.getCourse('sou-si-21');
  // let _code: ICode = { code: 123456, createdAt: new Date() }
  // await AttendanceCheckService.addAttendanceCheck({ attendanceCheckID: "w1", courseID: _course.courseID, students: [], attendanceCheckCode: _code });
  // await AttendanceCheckService.addAttendanceCheck({ attendanceCheckID: "w2", courseID: _course.courseID, students: [], attendanceCheckCode: _code });
  // await AttendanceCheckService.addAttendanceCheck({ attendanceCheckID: "w3", courseID: _course.courseID, students: [], attendanceCheckCode: _code });
  // let getCheck = await AttendanceCheckService.getAttendanceCheckByCode(_code.code);
  // console.log("get attendance by code", getCheck)
  // ADDSTUDENT HAVE BEEN REWRITTEN - THE FOLLOWING TEST IS NOT UPDATED YET
  //   let getStudent = await UserService.getUser('cs340@cphbusiness.dk')
  //   let getStudent2 = await UserService.getUser('rn118@cphbusiness.dk')
  //   await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent)
  //   await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent)
  //   await AttendanceCheckService.addStudentToAttendanceCheck(getCheck, getStudent2)
  //   console.log(await AttendanceCheckService.getAllAttendanceChecks())
  //   await AttendanceCheckService.deleteAttendanceCheck('w3')
  //   console.log('after delete')
  //   console.log(await AttendanceCheckService.getAllAttendanceChecks())
  // 
// }
// test();


