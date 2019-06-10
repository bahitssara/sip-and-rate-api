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

  describe(`POST /reviews`, () => {
    beforeEach('insert beverages', () =>
      helpers.seedBeveragesTables(
        db,
        testUsers,
        testBeverages,
      )
    )

    it(`creates an review, responding with 201 and the new review`, function() {
      this.retries(3)
      const testBeverages = testBeverages[0]
      const testUser = testUsers[0]
      const newReview = {
        id: 1,
        bev_type: 'test type',
        bev_name:'test name',
        user_review: 'First test review!',
        rating: 2,
        bev_id: testBeverages.id,
        user_id: testUser.id,
      }
      return supertest(app)
        .post('/reviews')
        .send(newReview)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.bev_type).to.eql(newReview.bev_type)
          expect(res.body.bev_name).to.eql(newReview.bev_name)
          expect(res.body.user_review).to.eql(newReview.user_review)
          expect(res.body.rating).to.eql(newReview.rating)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/reviews/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('sip_rate_reviews')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.bev_type).to.eql(newReview.bev_type)
              expect(row.bev_name).to.eql(newReview.bev_name)
              expect(row.user_review).to.eql(newReview.user_review)
              expect(row.rating).to.eql(newReview.rating)
              expect(row.bev_id).to.eql(newReview.bev_id)
              expect(row.user_id).to.eql(newReview.user_id)
            })
        )
    })

    // const requiredFields = ['text', 'rating', 'thing_id']

    // requiredFields.forEach(field => {
    //   const testThing = testThings[0]
    //   const testUser = testUsers[0]
    //   const newReview = {
    //     text: 'Test new review',
    //     rating: 3,
    //     thing_id: testThing.id,
    //   }

    //   it(`responds with 400 and an error message when the '${field}' is missing`, () => {
    //     delete newReview[field]

    //     return supertest(app)
    //       .post('/api/reviews')
    //       .set('Authorization', makeAuthHeader(userNoCreds))
    //       .send(newReview)
    //       .expect(400, {
    //         error: `Missing '${field}' in request body`,
    //       })
    //   })
    //})
  })
})