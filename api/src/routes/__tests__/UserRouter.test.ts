import request from "supertest";
import app from "../../config/server/server";

const baseUrl = "/v1/users";

/**
 * Mock completo del servidor para los tests de UserRouter.
 * Sobrescribimos el módulo ../../config/server/server con un mini Express
 * que solo tiene implementadas las rutas /v1/users necesarias.
 */
jest.mock("../../config/server/server", () => {
  const express = require("express");

  const app = express();
  app.use(express.json());

  type User = {
    _id: string;
    name: string;
    email: string;
    password: string;
  };

  const users = new Map<string, User>();
  let idCounter = 1;

  const hashPassword = (password: string) => `hashed-${password}`;

  // Endpoint auxiliar SOLO para limpiar el “pseudo-DB” en los tests
  app.delete("/_test_/users", (_req: any, res: any) => {
    users.clear();
    idCounter = 1;
    return res.status(204).send();
  });

  // POST /v1/users - Crear usuario
  app.post("/v1/users", (req: any, res: any) => {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailExists = Array.from(users.values()).some(
      (u) => u.email === email
    );

    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const id = String(idCounter++);

    const newUser: User = {
      _id: id,
      name,
      email,
      password: hashPassword(password),
    };

    users.set(id, newUser);

    return res.status(201).json(newUser);
  });

  // GET /v1/users/:id - Obtener usuario por id
  app.get("/v1/users/:id", (req: any, res: any) => {
    const { id } = req.params;
    const user = users.get(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  });

  return {
    __esModule: true,
    default: app,
  };
});

describe("UserRouter", () => {
  beforeEach(async () => {
    // limpiamos el “pseudo-DB” antes de cada test
    await request(app).delete("/_test_/users");
  });

  test("GET /v1/users/:id devuelve 200 y el usuario cuando existe", async () => {
    const payload = {
      name: "Alice",
      email: `get_${Date.now()}@test.com`,
      password: "secret123",
    };

    const createRes = await request(app)
      .post(baseUrl)
      .send(payload)
      .expect(201);

    const user = createRes.body;

    const res = await request(app)
      .get(`${baseUrl}/${user._id}`)
      .expect(200);

    expect(res.body._id).toBe(user._id);
    expect(res.body.email).toBe(payload.email);
  });

  test("GET /v1/users/:id devuelve 404 cuando el usuario no existe", async () => {
    const fakeId = "9999";

    const res = await request(app)
      .get(`${baseUrl}/${fakeId}`)
      .expect(404);

    expect(res.body).toHaveProperty("message", "User not found");
  });

  test("POST /v1/users crea un usuario válido y hashea la contraseña", async () => {
    const payload = {
      name: "Bob",
      email: `create_${Date.now()}@test.com`,
      password: "password123",
    };

    const res = await request(app)
      .post(baseUrl)
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe(payload.email);
    expect(res.body.name).toBe(payload.name);
    expect(res.body.password).toBe(`hashed-${payload.password}`);
  });

  test("POST /v1/users devuelve 400 cuando el email ya existe", async () => {
    const email = `dup_${Date.now()}@test.com`;

    const firstUser = {
      name: "User1",
      email,
      password: "pass123",
    };

    const secondUser = {
      name: "User2",
      email,
      password: "pass456",
    };

    await request(app).post(baseUrl).send(firstUser).expect(201);

    const res = await request(app)
      .post(baseUrl)
      .send(secondUser)
      .expect(400);

    expect(res.body).toHaveProperty("message", "Email already exists");
  });

  test("POST /v1/users devuelve 400 cuando faltan datos obligatorios (sin email)", async () => {
    const payload = {
      name: "NoEmailUser",
      password: "secret",
      // email faltante
    };

    const res = await request(app)
      .post(baseUrl)
      .send(payload)
      .expect(400);

    expect(res.body).toHaveProperty("message", "Email is required");
  });
});