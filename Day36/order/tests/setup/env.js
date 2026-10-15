process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://localhost:27017/test-db-skip-real";
process.env.JWT_SECRET =
  process.env.JWT_SECRET ||
  "3fbd0e6e07e0869f136180e1e57c5f4ba49194dafabcffb2c7d07dfb1e9a1275";
process.env.JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";
