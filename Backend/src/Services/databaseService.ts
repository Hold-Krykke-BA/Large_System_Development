import path from 'path';
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

var mongoDb = require('mongodb');
var mongoClient = mongoDb.MongoClient;

export default async () => {
	console.log('in databaseservice');
	const connection = process.env.CONNECTION || '';
	const client = mongoClient.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });
	return client;
};
