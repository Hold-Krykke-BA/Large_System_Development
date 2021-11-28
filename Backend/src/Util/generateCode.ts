import IUser from "../Models/IUser";
import UserService from "../Services/userService";
import userService from "../Services/userService";


export default async function newCode(teacherID: string): Promise<number> {
  let user = await UserService.getUser(teacherID);
  if (user && user.isTeacher) {
    for (let i = 0; i < 20; i++) {
      return Math.floor(100000 + Math.random() * 900000);
    }
  }

  return 1
}