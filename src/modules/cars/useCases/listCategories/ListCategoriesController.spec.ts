import request from "supertest"
import { Connection } from "typeorm"
import { hash } from "bcrypt"
import { v4 as uuidV4 } from "uuid"

import { app } from "@shared/infra/http/app"
import createConnection from "@shared/infra/typeorm"

let connection: Connection

describe('Create Categoy Controller', () => {

  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`
      INSERT INTO USERS(
        id, name, email, password, 
        "isAdmin", driver_license, created_at
      ) values (
        '${id}', 'admin', 'admin@rentx.com.br', '${password}', 
        true, 'license-admin', 'now()'
      )
    `)
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to list all categories", async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({
        email: "admin@rentx.com.br",
        password: "admin"
      })

    const { refresh_token } = responseToken.body

    await request(app)
      .post('/categories')
      .send({
        name: "Category super test",
        description: "Category super test"
      })
      .set({
        Authorization: `Bearer ${refresh_token}`
      })

    const response = await request(app).get('/categories')

    expect(response.status).toBe(201)
    expect(response.body.length).toBe(1)
    expect(response.body[0]).toHaveProperty('id')
  })
})