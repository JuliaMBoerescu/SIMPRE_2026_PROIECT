import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'azure_food_shop';

if (!uri) throw new Error('Missing MONGODB_URI');

let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

export async function getDb() {
  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri, {});
  }
  cached.client = await cached.promise;
  return cached.client.db(dbName);
}

export { ObjectId };
