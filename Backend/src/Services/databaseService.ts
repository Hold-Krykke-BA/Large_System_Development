import path from "path";
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
//import mongo from "mongodb";
//const MongoClient = mongo.MongoClient;
var mongoDb = require('mongodb');
var mongoClient = mongoDb.MongoClient;

export default async () => {
  const connection = process.env.CONNECTION || ""
  const client = mongoClient.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });
  return client;
}

