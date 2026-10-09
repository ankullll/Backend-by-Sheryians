require("dotenv").config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-only-secret-for-jest";
}
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

jest.setTimeout(60000);

beforeAll(async () => {
  mongo = await MongoMemoryServer.create({
    binary: {
      version: "8.0.12",
      systemBinary:
        "C:\\Users\\ankul\\.cache\\mongodb-binaries\\mongod-x64-win32-8.0.12.exe",
    },
  });

  const uri = mongo.getUri();

  process.env.MONGODB_URI = uri;

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
}, 60000);

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) return;

  for (const collection of Object.values(
    mongoose.connection.collections
  )) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongo) {
    await mongo.stop();
  }
}, 60000);
