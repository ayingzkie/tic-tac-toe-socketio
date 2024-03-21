import { Db, MongoClient } from "mongodb";

const database = async () => {
  const connectionString = process.env.DB_URI || "";

  const client = new MongoClient(connectionString);
  let conn;

  try {
    conn = await client.connect();
  } catch (e) {
    console.log(e);
  }

  let db = conn?.db("");

  return db;
};

export default database;
