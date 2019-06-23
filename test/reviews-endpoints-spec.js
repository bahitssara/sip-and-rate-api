const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Reviews Endpoints', function() {
  let db

  const testUsers = helpers.makeUsersArray()
  const testBeverages = helpers.makeBeveragesArray()

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

  beforeEach('insert users', () => {
      return db.into('sip_rate_users').insert(testUsers)
  })
  beforeEach('insert beverages', () => {
    return db.into('sip_rate_beverages').insert(testBeverages)
  })

  describe(`GET /reviews`, () => {
    context(`Given no reviews`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/reviews')
          .expect(200, [])
      })
    });

    context('Given there are reviews in the database', () => {
        const testReviews = helpers.makeReviewsArray();

        beforeEach('insert reviews', () => {
            return db
                .into('sip_rate_reviews')
                .insert(testReviews)
        })
        it('GET /reviews responds with 200 and all the reviews', () => {
          return supertest(app)
            .get('/reviews')
            .expect(200, testReviews)
        })
      })
  });

  describe('GET /reviews/:reviewId responds with 200 and all the reviews', () => {
    context('Given no reviews', () => {
      it('responds with 404 not found', () => {
        const reviewId = 123456;
        return supertest(app)
          .get(`/reviews/${reviewId}`)
          .expect(404, {error: {message: `Review doesn't exist`} })
      })
    })

    context('Given there are reviews in the database', () => {
      const testReview = [
        {
          id: 1,
          bev_type: 'test type',
          bev_name:'test name',
          user_review: 'First test review!',
          rating: 2,
          bev_id: 'apothicdark20124',
          user_id: 1,
          date_created: '2029-01-22T16:28:32.615Z',
        }
      ];

      beforeEach('insert review', () => {
        return db.into('sip_rate_reviews').insert(testReview)
      })

      it('responds with 200 and the specified review', () => {
        const reviewId = 1;
        const expectedReview = testReview[reviewId -1];
        return supertest(app)
          .get(`/reviews/${reviewId}`)
          .expect(200, expectedReview)
      })
    })
  })

  describe('POST /reviews', () => {
    context('Given there are reviews in the database', () => {
      const testReviews = helpers.makeReviewsArray()
      beforeEach('insert reviews', () => {
          return db
              .into('sip_rate_reviews')
              .insert(testReviews)
      })
    })

    it('creates a review, responding with 201 and a new review', () => {
      const newReview = 
        {
          id: 1,
          bev_type: 'test type',
          bev_name:'test name',
          user_review: 'First test review!',
          rating: 2,
          bev_id: 'apothicdark20124',
          user_id: 1,
          date_created: '2029-01-22T16:28:32.615Z',
        };
      return supertest(app)
        .post('/reviews')
        .send(newReview)
        .expect(201)
        .expect(res => {
          expect(res.body.bev_type).to.eql(newReview.bev_type)
          expect(res.body.bev_name).to.eql(newReview.bev_name)
          expect(res.body.user_review).to.eql(newReview.user_review)
          expect(res.body.rating).to.eql(newReview.rating)
          expect(res.body.bev_id).to.eql(newReview.bev_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/reviews/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/reviews/${res.body.id}`)
            .expect(res.body)
        )
    })
  })

  describe('DELETE /reviews/:reviewId', () => { 
    context('Given no reviews', () => {
      it('responds with 404 not found', () => {
        const reviewId = 123456;
        return supertest(app)
          .delete(`/reviews/${reviewId}`)
          .expect(404, { error: { message: `Review doesn't exist`} })
      })
    })
    context('Given there are reviews in the database', () => {
      const testReviews = helpers.makeReviewsArray()

      beforeEach('insert reviews', () => {
        return db.into('sip_rate_reviews').insert(testReviews)
      })

      it('responds with 204 and removes the review', () => {
        const reviewToDelete = 1;
        const expectedReviews = testReviews.filter(
          review => review.id !== reviewToDelete
        );
        return supertest(app)
          .delete(`/reviews/${reviewToDelete}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get('/reviews')
              .expect(expectedReviews)
            )
      })
    })
  })
})
