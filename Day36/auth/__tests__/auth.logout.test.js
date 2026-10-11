const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const userModel = require("../src/models/user.model");

it("clears the auth cookie and returns 200 when logged in", async () => {
  const password = "Secret123!";
  const hash = await bcrypt.hash(password, 10);
  await userModel.create({
    username: "logout_user",
    email: "logout@example.com",
    password: hash,
    fullName: {
      firstName: "Log",
      lastName: "Out",
    },
  });

  // Log in to obtain the authentication cookie
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "logout@example.com",
    password,
  });
  expect(loginRes.statusCode).toBe(200);

  const cookies = loginRes.headers["set-cookie"];
  expect(cookies).toBeDefined();

  // Send the cookie to the logout endpoint
  const logoutRes = await request(app)
    .get("/api/auth/logout")
    .set("Cookie", cookies);
  expect(logoutRes.statusCode).toBe(200);
  expect(logoutRes.headers["set-cookie"]).toBeDefined();
  expect(logoutRes.headers["set-cookie"].join(";")).toMatch(/token=/);
});
