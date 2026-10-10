const request = require("supertest");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const userModel = require("../src/models/user.model");

describe("POST /api/auth/login", () => {
  it("should login a user successfully", async () => {
    const password = "Secret123!";
    const hash = await bcrypt.hash(password, 10);

    await userModel.create({
      username: "john_doe",
      email: "john@doe.com",
      password: hash,
      fullName: {
        firstName: "john",
        lastName: "doe",
      },
    });

    const res = await request(app).post("/api/auth/login").send({
      username: "john_doe",
      email: "john@doe.com",
      password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("john@doe.com");

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie.join(";")).toMatch(/token=/);
  });

  it("should reject login with an unregistered email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "unknown@example.com",
      password: "Secret123!",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should reject wrong password with 401", async () => {
    const password = "Secret123!";
    const hash = await bcrypt.hash(password, 10);

    await userModel.create({
      username: "jane_doe",
      email: "jane@doe.com",
      password: hash,
      fullName: {
        firstName: "jane",
        lastName: "Doe",
      },
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "john@doe.com",
      password: "WrongPassword123!",
    });

    expect(res.statusCode).toBe(401);
  })

  it("validates missing fields with 400", async()=>{
    const res = await request(app).post('/api/auth/login').send({})

    expect(res.statusCode).toBe(400)
  })
});
