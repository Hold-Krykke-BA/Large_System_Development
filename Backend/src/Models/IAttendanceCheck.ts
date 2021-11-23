import IUser from "./IUser";

export default interface IAttendanceCheck {
  attendanceCheckID: string,
  courseID: string,
  Students: Array<IUser>
  Code: number,
  CreatedDate: Date,
  TTL: Date
}