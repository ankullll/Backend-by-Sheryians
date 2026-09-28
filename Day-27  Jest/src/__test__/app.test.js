const request = require("supertest")

const app = require('../app')

describe("GET /",()=>{
    it("should return 200 ", async()=>{
        const res = await request(app).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("message","Working")
    })
})

describe("POST /api/auth/register",()=>{
    it("Should return 201 with user email and username", async()=>{
        const res = await request(app).post("/api/auth/register").send({
            username:"testuser",
            email:"abc@d.com"
        })
        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty("username")
        expect(res.body).toHaveProperty("email")

    })
})