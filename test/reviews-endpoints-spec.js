const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Reviews Endpoints', function() {
  let db

  const {
    testBeverages,
    testUsers,
  } = helpers.makeFixtures()

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

  describe(`GET /reviews`, () => {
      context(`Given no reviews`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
                .get('/reviews')
                .expect(200, [])
          })
      })

      context('Given there are reviews in the database', () => {
          const testReviews = helpers.makeReviewsArray()
          beforeEach('insert beverages', () => {
              return db
                .into('sip_rate_reviews')
                .insert(testReviews)
          })

          it('responds with 200 and all of the beverages', () => {
              const expectedReview = helpers.makeReviewsArray()

              return supertest(app)
                .get('/reviews')
                .expect(200, expectedReview)
          })
      })
  })

  describe(`POST /reviews`, () => {
    beforeEach('insert beverages', () =>
      helpers.seedBeveragesTables(
        db,
        testUsers,
        testBeverages,
      )
    )


    
  })
})