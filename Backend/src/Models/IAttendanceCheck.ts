import ICode from "./ICode";
import IUser from "./IUser";

export default interface IAttendanceCheck {
  attendanceCheckID: string,
  courseID: string,
  students: Array<IUser>
  attendanceCheckCode: ICode
}