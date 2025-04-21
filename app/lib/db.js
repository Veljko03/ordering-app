import mongoose from "mongoose";

const MONGO_DB_URL = process.env.NEXT_MONGO_URL;

if (!MONGO_DB_URL) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

//mozda nece trebati uopste
