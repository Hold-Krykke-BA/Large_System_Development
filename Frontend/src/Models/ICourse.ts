import IUser from "./IUser"
import IAttendanceCheck from "./IAttendanceCheck"

export default interface ICourse {
  courseID: string,
  courseName: string,
  teachers: Array<IUser>,
  students: Array<IUser>,
  attendanceChecks: Array<IAttendanceCheck>
}