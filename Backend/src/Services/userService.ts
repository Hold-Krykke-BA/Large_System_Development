const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
import * as mongo from "mongodb"
import IUser from "../Models/IUser";
import { bryptAsync, bryptCheckAsync } from "../Util/bcryptHelper"
import connection from "./databaseService"

let userCollection: mongo.Collection;

export default class UserFacade {
  static async setDatabase(client: mongo.MongoClient) {
    const dbName = process.env.DB_NAME;
    if (!dbName) {
      throw new Error("Database name not provided")
    }
    try {
      await client.connect();
      userCollection = client.db(dbName).collection("users");
      await userCollection.createIndex({ userID: 1 }, { unique: true })
      return client.db(dbName);

    } catch (err) {
      console.error("Could not create connect", err)
    }
  }

  static async addUser(user: IUser): Promise<any> {
    const hash = await bryptAsync(user.password);
    let newUser = { ...user, password: hash }
    try {
      return await userCollection.insertOne(newUser);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  static async getAllUsers(proj?: object): Promise<Array<any>> {
    const all = userCollection.find(
      {},
      { projection: proj }
    )
    return all.toArray();
  }
}

async function test() {
  console.log("testing")
  const client = await connection();
  await UserFacade.setDatabase(client)
  await UserFacade.addUser({ userID: "aoc@cphbusiness.dk", name: "Andrea", password: "secret", isTeacher: true })
  await UserFacade.addUser({ userID: "cs340@cphbusiness.dk", name: "Camilla", password: "secret", isTeacher: false })

  const all = await UserFacade.getAllUsers();
  console.log(all)
}
test();