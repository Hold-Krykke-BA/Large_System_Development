const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import IUser from "../Models/IUser";
import IAttendanceCheck from "../Models/IAttendanceCheck";
import ICourse from "../Models/ICourse";
import connection from "./databaseService"

let attendanceCheckCollection: mongo.Collection;

export default class AttendanceCheckService {
  static async setDatabase(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      await client.connect();
      attendanceCheckCollection = client.db(dbName).collection("attendanceChecks");
      await attendanceCheckCollection.createIndex({ courseID: 1 }, { unique: true })
      return client.db(dbName);

    } catch (err) {
      console.error("Could not create connect", err)
    }
  }
}