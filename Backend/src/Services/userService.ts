const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
import * as mongo from 'mongodb';
import IUser from '../Models/IUser';
import { bryptAsync, bryptCheckAsync } from '../Util/bcryptHelper';

let userCollection: mongo.Collection;

export default class UserService {
	static async setDatabase(client: mongo.MongoClient) {
		console.log('in userservice');
		const dbName = process.env.DB_NAME;
		if (!dbName) {
			throw new Error('Database name not provided');
		}
		try {
			await client.connect();
			userCollection = client.db(dbName).collection('users');
			await userCollection.createIndex({ userID: 1 }, { unique: true });
			return client.db(dbName);
		} catch (err) {
			console.error('Could not create connect', err);
		}
	}

	static async addUser(user: IUser): Promise<any> {
		const hash = await bryptAsync(user.password);
		let newUser = { ...user, password: hash };
		try {
			return await userCollection.insertOne(newUser);
		} catch (err: any) {
			console.error(err.message);
		}
	}

	static async getUser(userID: string, proj?: object): Promise<any> {
		const user = await userCollection.findOne({ userID }, proj);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	static async deleteUser(userID: string): Promise<string> {
		const status = await userCollection.deleteOne({ userID });
		if (status.deletedCount === 1) {
			return 'User was deleted';
		} else throw new Error('Requested delete could not be performed');
	}

	static async getAllUsers(proj?: object): Promise<Array<any>> {
		const all = userCollection.find({}, { projection: proj });
		return all.toArray();
	}

	static async checkUser(userID: string, password: string): Promise<boolean> {
		let userPassword = '';
		try {
			const user = await UserService.getUser(userID);
			userPassword = user.password;
		} catch (err) {}
		const status = await bryptCheckAsync(password, userPassword);
		return status;
	}
}

// async function test() {
//   console.log('"testing"')
//   const client = await connection();
//   await UserService.setDatabase(client)
//   await UserService.addUser({ userID: "aoc@cphbusiness.dk", userName: "Andrea", password: "secret", isTeacher: true });
//   await UserService.addUser({ userID: "rn118@cphbusiness.dk", userName: "Runi", password: "secret", isTeacher: false });
//   await UserService.addUser({ userID: "cs340@cphbusiness.dk", userName: "Camilla", password: "secret", isTeacher: false });

//   const projection = { projection: { _id: 0, isTeacher: 0, password: 0 } }
//   const userCS = await UserService.getUser("cs340@cphbusiness.dk", projection)
//   console.log('Get Single User', userCS)

//   try {
//     const passwordStatus1 = await UserService.checkUser("cs340@cphbusiness.dk", "secret");
//     console.log("Expects true: ", passwordStatus1)
//   } catch (err) {
//     console.log("Should not get here 1", err)
//   }
//   try {
//     const passwordStatus2 = await UserService.checkUser("cs340@cphbusiness.dk", "xxxx");
//     console.log("Should not get here ", passwordStatus2)
//   } catch (err) {
//     console.log("Should get here with failded 2", err)
//   }
//   try {
//     const passwordStatus3 = await UserService.checkUser("xxxx@b.dk", "secret");
//     console.log("Should not get here", passwordStatus3)
//   } catch (err) {
//     console.log("hould get here with failded 2", err)
//   }

//   // try {
//   //   let statusMsg = await UserService.deleteUser("cs340@cphbusiness.dk");
//   //   console.log(statusMsg)
//   //   await UserService.deleteUser("xxxx@b.dk");
//   // } catch (err: any) {
//   //   console.log(err.message)
//   // }

//   const all = await UserService.getAllUsers();
//   console.log(all)
// }
// test();
