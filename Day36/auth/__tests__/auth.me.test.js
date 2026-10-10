const request = require("supertest");
const app = require("../src/app");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const userModel = require("../src/models/user.model")



describe("GET /api/auth/me", () => {
  it("should return 401 when no auth cookie is provided", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
  });

  it("should return 401 for an invalid token cookie", async () => {
    const fakeToken = jwt.sign(
      { id: "000000000000000000000000" },
      "wrong_secret",
    );

    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", [`token=${fakeToken}`]);

    expect(res.statusCode).toBe(401);
  });
  
it("should return 200 and current user with a valid token", async () => {
  const password = "Secret123!";
  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: "john_doe",
    email: "john@doe.com",
    password: hash,
    fullName: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  const token = jwt.sign(
    { id: user._id,
        email:user.email
     },
    process.env.JWT_SECRET
  );

  const res = await request(app)
    .get("/api/auth/me")
    .set("Cookie", [`token=${token}`]);

  expect(res.statusCode).toBe(200);
  expect(res.body.user).toBeDefined();
  expect(res.body.user.email).toBe("john@doe.com");
});

});
