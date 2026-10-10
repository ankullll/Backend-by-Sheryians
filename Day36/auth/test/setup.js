process.env.JWT_SECRET = "1df822c4adb4119ea5fd19b06464c25062ef8e8d899031b521836a1f9949687b";
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(30000);
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();
  await mongoose.connect(uri,{
      serverSelectionTimeoutMS: 5000,
  });

});

afterAll(async ()=>{
    await mongoose.disconnect()
    await mongoServer.stop()

})