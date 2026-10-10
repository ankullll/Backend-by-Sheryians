
if (process.env.NODE_ENV === "test") {
  class FakeRedis {
    constructor() {
      this.store = new Map();
      this.expires = new Map();
    }

    on() {
      return this;
    }

    async set(key, value, ...args) {
      this.store.set(key, value);

      const exIndex = args.findIndex(
        (arg) => String(arg).toUpperCase() === "EX"
      );

      if (exIndex !== -1 && args[exIndex + 1] !== undefined) {
        this.expires.set(
          key,
          Date.now() + Number(args[exIndex + 1]) * 1000
        );
      }

      return "OK";
    }

    async get(key) {
      const expiry = this.expires.get(key);

      if (expiry && Date.now() >= expiry) {
        this.store.delete(key);
        this.expires.delete(key);
        return null;
      }

      return this.store.get(key) ?? null;
    }

    async del(key) {
      this.expires.delete(key);
      return this.store.delete(key) ? 1 : 0;
    }

    async quit() {
      return "OK";
    }
  }

  module.exports = new FakeRedis();
} else {
  const { Redis } = require("ioredis");

  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  redis.on("connect", () => {
    console.log("Connected to Redis");
  });

  module.exports = redis;
}
