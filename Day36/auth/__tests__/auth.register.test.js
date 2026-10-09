
const request = require("supertest");
const app = require("../src/app");

describe("POST /api/auth/register", () => {
  it("creates a user and returns 201 with user (no password)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "john_doe",
        email: "john@example.com",
        password: "Secret123!",
        fullName: {
          firstName: "John",
          lastName: "Doe",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe("john_doe");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.user.password).toBeUndefined();
  });

  it("rejects duplicate username/email with 409", async () => {
    const user = {
      username: "duplicate_user",
      email: "duplicate@example.com",
      password: "Secret123!",
      fullName: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    // First registration should succeed
    const firstRes = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(firstRes.status).toBe(201);

    // Second registration with the same details should fail
    const secondRes = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(secondRes.status).toBe(409);
  });

  it("rejects missing fields with 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "incomplete_user",
        email: "incomplete@example.com",
      });

    expect(res.status).toBe(400);
  });
});
