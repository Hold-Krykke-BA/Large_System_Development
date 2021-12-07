const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });
import * as mongo from 'mongodb';
import IWhitelist from '../Models/IWhitelist';

let whitelistCollection: mongo.Collection;
let _whitelistID: string = 'ip-whitelist';

export default class WhitelistService {
	static async setDatabase(client: mongo.MongoClient) {
		console.log('in whitelistservice');
		const dbName = process.env.DB_NAME;
		if (!dbName) {
			throw new Error('Database name not provided');
		}
		try {
			await client.connect();
			whitelistCollection = client.db(dbName).collection('whitelist');
			await whitelistCollection.createIndex({ whitelistID: 1 }, { unique: true });
			await WhitelistService.createWhitelist();
			return client.db(dbName);
		} catch (err) {
			console.error('Could not create connect', err);
		}
	}

	private static async createWhitelist(): Promise<any> {
		let exists = await whitelistCollection.find();
		if (!(await exists.count())) {
			let newWhitelist: IWhitelist = { whitelistID: _whitelistID, IPs: [] };
			try {
				return await whitelistCollection.insertOne(newWhitelist);
			} catch (err: any) {
				console.error(err.message);
			}
		}
	}

	static async getWhitelist(proj?: object): Promise<any> {
		const whitelist = await whitelistCollection.findOne({ whitelistID: _whitelistID }, proj);
		if (!whitelist) {
			throw new Error('Whitelist not found');
		}
		return whitelist;
	}

	static async addToWhitelist(IP: string): Promise<any> {
		let _whitelist: IWhitelist = await WhitelistService.getWhitelist();
		let checkIP = _whitelist.IPs.filter((i) => i === IP);
		if (checkIP.length) {
			return _whitelist;
		}
		if (_whitelist) {
			_whitelist.IPs.push(IP);
			await whitelistCollection.updateOne({ whitelistID: _whitelistID }, { $set: { IPs: _whitelist.IPs } });
		}
		return _whitelist;
	}

	static async removeFromWhitelist(IP: string): Promise<any> {
		let _whitelist: IWhitelist = await WhitelistService.getWhitelist();
		if (_whitelist) {
			let updatedArray = _whitelist.IPs.filter((ip) => ip !== IP);
			await whitelistCollection.updateOne({ whitelistID: _whitelistID }, { $set: { IPs: updatedArray } });
		}
		_whitelist.IPs.filter((ip) => ip !== IP);
		return _whitelist;
	}
}

// async function test() {
//   console.log('"testing"')
//   const client = await connection();
//   await WhitelistService.setDatabase(client)
//   console.log('**************************************************************************** get whitelist', await WhitelistService.getWhitelist())
//   await WhitelistService.addToWhitelist('123')
//   await WhitelistService.addToWhitelist('123134')
//   await WhitelistService.addToWhitelist('1345')
//   await WhitelistService.addToWhitelist('12.53.122')
//   await WhitelistService.addToWhitelist('12.313.554')
//   await WhitelistService.addToWhitelist('13.45.576')
//   await WhitelistService.removeFromWhitelist('1345')

// }
// test();
