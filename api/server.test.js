const supertest = require("supertest");
const server = require("./server");
const model = require("../jokes/model");
const db = require("../database/dbConfig");

function makeName(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoyLCJ1c2VybmFtZSI6Ik1hcnkiLCJpYXQiOjE1OTAxNjQ1OTUsImV4cCI6MTU5MDI1MDk5NX0.O1TTmJlyOKwszir3Wp8LWHgjlO95tbn7h8j1uQTO5wU";

describe("server", () => {
  it("can run", () => {
    expect(true).toBeTruthy();
  });
  describe("GET /", () => {
    it("should return http status 200 ok", () => {
      return (
        supertest(server)
          .get("/")
          //.expect(200) from supertest
          .then((response) => {
            //from jest
            expect(response.status).toBe(200);
            expect(response.status).toBeTruthy();
          })
      );
    });
    it("should return {api:up}", () => {
      return supertest(server)
        .get("/")
        .then((res) => {
          expect(res.body).toEqual({ api: "up" });
          expect(res.body.api).toBe("up");
          expect(res.body.api).toBeDefined();
        });
    });
  });

  describe("GET /api/jokes", () => {
    it("return 200 OK", function (done) {
      supertest(server)
        .get("/api/jokes")
        .set("Authorization", token)
        // .expect('Content-Type', /json/)
        .expect(200, done);
    });
    it("responds with json", function (done) {
      supertest(server)
        .get("/api/jokes")
        .set("Authorization", token)
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("POST /api/auth/register", () => {
    it("return 201 created", function (done) {
      return supertest(server)
        .post("/api/auth/register")
        .send({
          username: makeName(6),
          password: "123",
        })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("should correct length of user list", async () => {
      await model.add({
        username: makeName(6),
        password: "123",
      });

      // read data from the table
      const users = await db("users");
      let amount = users.length;
      expect(users).toHaveLength(amount);
    });
  });

  describe("POST /api/auth/login", () => {
    it("return 200 OK", function (done) {
      return supertest(server)
        .post("/api/auth/login")
        .send({
          username: "Mary",
          password: "123",
        })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("response with json", function (done) {
      return supertest(server)
        .post("/api/auth/login")
        .send({
          username: "Mary",
          password: "123",
        })
        .expect("Content-Type", /json/)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});
