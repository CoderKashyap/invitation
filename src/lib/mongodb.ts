import mongoose from "mongoose";

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as unknown as { mongoCache?: MongoCache };

const cache = globalForMongo.mongoCache ?? { conn: null, promise: null };
globalForMongo.mongoCache = cache;

function mongoUri() {
  const raw = process.env.MONGODB_URI?.trim();
  if (!raw) throw new Error("MONGODB_URI is missing from .env");
  return raw.replace(/^['"]|['"]$/g, "");
}

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri(), { bufferCommands: false });
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
