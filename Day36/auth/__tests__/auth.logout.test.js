const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const userModel = require("../src/models/user.model");


it("clears the auth cookie and returns 200 when logged in", async () => {
      console.log("1. Test started");
  const password = "Secret123!";
  const hash = await bcrypt.hash(password, 10);
  console.log("2. Password hashed");
  await userModel.create({
    username: "logout_user",
    email: "logout@example.com",
    password: hash,
    fullName: {
      firstName: "Log",
      lastName: "Out",
    },
  });
  console.log("3. User created");

  // Log in to obtain the authentication cookie
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "logout@example.com",
      password,
    });
  console.log("4. Login response:", loginRes.statusCode);
  expect(loginRes.statusCode).toBe(200);

  const cookies = loginRes.headers["set-cookie"];
  console.log("5. Cookie received:", Boolean(cookies)); 
  expect(cookies).toBeDefined();

  // Send the cookie to the logout endpoint
  const logoutRes = await request(app)
    .get("/api/auth/logout")
    .set("Cookie", cookies);
      console.log("6. Logout response:", logoutRes.statusCode);
  expect(logoutRes.statusCode).toBe(200);
  expect(logoutRes.headers["set-cookie"]).toBeDefined();
  expect(logoutRes.headers["set-cookie"].join(";")).toMatch(/token=/);
});
