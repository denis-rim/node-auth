import { client } from "../db.js";

export const session = client.db("test").collection("session");

// Add indexes to token
session.createIndex({ sessionToken: 1 });
