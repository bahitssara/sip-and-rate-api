const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Beverages Endpoints', function() {
  let db

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


  describe(`GET /beverages`, () => {
    context(`Given no beverages`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/beverages')
          .expect(200, [])
      })
    })

    context('Given there are things in the database', () => {
        const testBeverages = helpers.makeBeveragesArray()
      beforeEach('insert things', () => {
        return db
            .into('sip_rate_beverages')
            .insert(testBeverages)
      })

      it('responds with 200 and all of the beverages', () => {
        const expectedBeverage = helpers.makeBeveragesArray()
        
        return supertest(app)
          .get('/beverages')
          .expect(200, expectedBeverage)
      })
    })   

  describe(`GET /beverages/:bev_id`, () => {
    context(`Given no beverages`, () => {
      it(`responds with 404`, () => {
        const bevId = 123456
        return supertest(app)
          .get(`/beverages/${bevId}`)
          .expect(404, { error: { message:`Beverage doesn't exist` } })
      })
    })
  })

    context('Given there are beverages in the database', () => {
        const testBeverages = helpers.makeBeveragesArray()

      beforeEach('insert beverages', () =>{
        return db
            .into('sip_rate_beverages')
            .insert(testBeverages)
      })
    })

      it('responds with 200 and the specified beverage', () => {
        const bevId = 2
        const testBeverages = helpers.makeBeveragesArray()
        const expectedBeverage = testBeverages[bevId - 1]
        console.log(expectedBeverage)
        return supertest(app)
          .get(`/beverages/${bevId}`)
          .expect(200, expectedBeverage)
      })
   })
})
