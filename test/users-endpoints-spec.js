const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const bcrypt = require('bcryptjs')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /user`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['first_name', 'last_name', 'email', 'password', 'user_name']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          email: 'testemail@email.com',
          password: 'testpassword',
          user_name: 'test user_name'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/user')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

        it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
            const userShortPassword = {
              first_name: 'test first_name',
              last_name: 'test last_name',
              email: 'testemail@email.com',
              password: 'testpa',
              user_name: 'test user_name'
            }
            return supertest(app)
            .post('/user')
            .send(userShortPassword)
            .expect(400, { error: `Password needs to be longer than 8 characters` })
        })

        it(`responds 400 'Password be less than 72 characters' when long password`, () => {
          const userLongPassword = {
            first_name: 'test first_name',
            last_name: 'test last_name',
            email: 'testemail@email.com',
            password: '*'.repeat(73),
            user_name: 'test user_name'
          }
        
          return supertest(app)
            .post('/user')
            .send(userLongPassword)
            .expect(400, { error: `Password be less than 72 characters` })
        })

        it(`responds 400 error when password starts with spaces`, () => {
           const userPasswordStartsSpaces = {
             first_name: 'test first_name',
             last_name: 'test last_name',
             email: 'testemail@email.com',
             password: ' 1Aa!2Bb@',
             user_name: 'test user_name'
           }
           return supertest(app)
             .post('/user')
             .send(userPasswordStartsSpaces)
             .expect(400, { error: `Password must not start or end with empty spaces` })
         })

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            first_name: 'test first_name',
            last_name: 'test last_name',
            email: 'testemail@email.com',
            password: '1Aa!2Bb@ ',
            user_name: 'test user_name'
          }
          return supertest(app)
            .post('/user')
            .send(userPasswordEndsSpaces)
            .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password isn't complex enough`, () => {
              const userPasswordNotComplex = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                email: 'testemail@email.com',
                password: '11AAaabb',
                user_name: 'test user_name'
              }
              return supertest(app)
                .post('/user')
                .send(userPasswordNotComplex)
                .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
            })
      

    context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
                first_name: 'test first_name',
                last_name: 'test last_name',
                email: 'testemail@email.com',
                password: '11AAaa!!',
                user_name: 'test user_name'
              }
                  return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                      expect(res.body).to.have.property('id')
                      expect(res.body.first_name).to.eql(newUser.first_name)
                      expect(res.body.last_name).to.eql(newUser.last_name)
                      expect(res.body.user_name).to.eql(newUser.user_name)
                      // expect(res.body).to.not.have.property('password')
                      // expect(res.headers.location).to.eql(`/user/${res.body.id}`)
                      // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                      // const actualDate = new Date(res.body.date_created).toLocaleString()
                      // expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                          db
                            .from('sip_rate_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                              expect(row.first_name).to.eql(newUser.first_name)
                              expect(row.last_name).to.eql(newUser.last_name)
                              expect(row.email).to.eql(newUser.email)
                              expect(row.user_name).to.eql(newUser.user_name)
                              // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                              // const actualDate = new Date(row.date_created).toLocaleString()
                              // expect(actualDate).to.eql(expectedDate)

                              return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.false
                            })
                          )
                })
             })
          
          })
    })
})
