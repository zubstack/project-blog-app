const request = require("supertest");
const app = require("../app");
const api = request(app);
const endpoint = "/api/users";

describe("Testing the routes belonging to the entity: users", () => {
  test("receive response in json", async () => {
    await api.get(endpoint).expect("Content-Type", /json/).expect(200);
  });
});
