import mongoose from "mongoose";
import { Log } from "../utils/log.js";
import { dbMaxRetries, dbRetryDelay, dbMongoURI, dbName } from "./env.js";

const db = mongoose.connection;

let retryCount = 0;

export const dbConnect = async () => {
  try {
    Log.info(
      `connecting to database: ${
        retryCount > 0 ? `tries ${retryCount}` : ""
      }...`
    );
    await mongoose.connect(`${dbMongoURI}${dbName}`, {
      retryWrites: true,
      w: "majority",
      appName: "Cluster0",
    });
    Log.info("success: connected to database!");
  } catch (error) {
    retryCount++;
    Log.error(`MongoDB connection failed. Retry attempt: ${retryCount}`);

    if (retryCount < dbMaxRetries) {
      Log.info(`Retrying in ${dbRetryDelay / 1000} seconds...`);
      setTimeout(dbConnect, dbRetryDelay);
    } else {
      Log.error(`Max retry attempts reached (${dbMaxRetries}). Exiting...`);
      process.exit(1);
    }
  }
};

export const dbError = db.on("error", (err) => {
  Log.error(`MongoDB connection error: ${err}`);
});
