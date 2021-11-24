const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import IUser from "../Models/IUser";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import ICourse from "../Models/ICourse";
import connection from "./databaseService"
import UserService from "./userService"

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

  static async addCourse(course: ICourse): Promise<any> {
    let _students = course.students.filter(s => !s.isTeacher);
    let _teachers = course.teachers.filter(s => s.isTeacher);
    let newcourse = { ...course, students: _students, teachers: _teachers }
    try {
      return await courseCollection.insertOne(newcourse);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  static async getCourse(courseID: string, proj?: object): Promise<any> {
    const course = await courseCollection.findOne(
      { courseID },
      proj
    )
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }

  static async deleteCourse(courseID: string): Promise<string> {
    const status = await courseCollection.deleteOne({ courseID })
    if (status.deletedCount === 1) {
      return "Course was deleted";
    }
    else throw new Error("Requested delete could not be performed")
  }

  static async getAllCourses(proj?: object): Promise<Array<any>> {
    const all = courseCollection.find(
      {},
      { projection: proj }
    )
    return all.toArray();
  }

  static async userIsTeacher(user: IUser): Promise<IUser | null> {
    if (user.isTeacher) { return user }
    return null
  }
}

async function test() {
  console.log('"testing"')
  const client = await connection();
  await CourseService.setDatabase(client)
  let testTeachers = Array<IUser>();
  testTeachers.push(
    await UserService.getUser("cs340@cphbusiness.dk"), await UserService.getUser("aoc@cphbusiness.dk")
  );


  let testStudents = Array<IUser>();
  testStudents = await UserService.getAllUsers()
  let testAttendanceCheck = Array<IAttendanceCheck>();

  await CourseService.addCourse({ courseID: "sou-si-21", courseName: "System Integration", teachers: testTeachers, students: testStudents, attendanceChecks: testAttendanceCheck })
  await CourseService.addCourse({ courseID: "sou-ls-21", courseName: "Large System Development", teachers: testTeachers, students: testStudents, attendanceChecks: testAttendanceCheck })

  const projection = { projection: { _id: 0, isTeacher: 0, password: 0 } }
  const userCS = await CourseService.getCourse("sou-si-21", projection)
  console.log('Get Single Course', userCS)

  // try {
  //   let statusMsg = await CourseService.deleteCourse("sou-ls-21");
  //   console.log(statusMsg)
  //   await CourseService.deleteCourse("xxxx@b.dk");
  // } catch (err: any) {
  //   console.log(err.message)
  // }

  const all = await CourseService.getAllCourses();
  console.log(all)
}
test();