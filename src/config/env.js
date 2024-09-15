export const appPort = process.env.PORT || 8080;
export const nodeEnv = process.env.NODE_ENV || "development";
export const dbMongoURI = process.env.MONGO_DB_URI;
export const dbName = process.env.DATABASE_NAME;
export const dbMaxRetries = process.env.MONGO_MAX_RETRIES || 5;
export const dbRetryDelay = process.env.MONGO_RETRY_DELAY || 3000;
export const appSecret = process.env.APP_SECRET;
export const jwtExpirationTime = process.env.JWT_EXPIRATION_TIME || "1h";
