const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import IUser from "../Models/IUser";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import ICourse from "../Models/ICourse";
import connection from "./databaseService"

let courseCollection: mongo.Collection;

export default class CourseService {
  static async setDatabase(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      await client.connect();
      courseCollection = client.db(dbName).collection("courses");
      await courseCollection.createIndex({ courseID: 1 }, { unique: true })
      return client.db(dbName);

    } catch (err) {
      console.error("Could not create connect", err)
    }
  }
  // const hash = await bryptAsync(user.password);
  // let newUser = { ...user, password: hash }

  static async addCourse(course: ICourse): Promise<any> {
    let newcourse = { ...course }
    try {
      return await courseCollection.insertOne(newcourse);
    } catch (err: any) {
      console.error(err.message);
    }
  }
}
// courseID: string,
// courseName: string,
// teachers: Array < IUser >,
// students: Array < IUser >,
// attendanceChecks: Array < IAttendanceCheck >

async function test() {
  console.log("testing")
  const client = await connection();
  await CourseService.setDatabase(client)
  let testTeachers = Array<IUser>();
  testTeachers.push(
    { userID: "aoc@cphbusiness.dk", userName: "Andrea", password: "secret", isTeacher: true }
  );
  let testStudents = Array<IUser>();
  testStudents.push(
    { userID: "cs340@cphbusiness.dk", userName: "Camilla", password: "secret", isTeacher: false },
    { userID: "rn118@cphbusiness.dk", userName: "Runi", password: "secret", isTeacher: false });

  let testAttendanceCheck = Array<IAttendanceCheck>();

  await CourseService.addCourse({ courseID: "sou-si-21", courseName: "System Integration", teachers: testTeachers, students: testStudents, attendanceChecks: testAttendanceCheck })
  await CourseService.addCourse({ courseID: "sou-ls-21", courseName: "Large System Development", teachers: testTeachers, students: testStudents, attendanceChecks: testAttendanceCheck })
}
test();