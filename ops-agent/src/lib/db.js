import {MongoClient} from "mongodb" 

const MONGO_URI = process.env.MONGO_URI;
const mongoClient = new MongoClient(MONGO_URI, { serverselectionTimeoutMS: 3002});

export async function saveinvestigation(investigationData) {
    await mongoClient.connect();
    const collection = mongoClient.db("agent-inv").collection("investigations");
    await collection.insertOne(investigationData);
}