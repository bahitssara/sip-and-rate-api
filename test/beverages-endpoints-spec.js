const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Beverages Endpoints', function() {
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

    context('Given there are beverages in the database', () => {
        const testBeverages = helpers.makeBeveragesArray()
        beforeEach('insert beverages', () => {
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

  describe(`GET /beverages/:id`, () => {
    context(`Given no beverages`, () => {
      it(`responds with 404`, () => {
        const bevId = 123456
        return supertest(app)
          .get(`/beverages/${bevId}`)
          .expect(404, { error: { message:`Beverage doesn't exist` } })
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

      // it('responds with 200 and the specified beverage', () => {
      //   const bevId = 2
      //   const testBeverages = helpers.makeBeveragesArray()
      //   const expectedBeverage = helpers.makeExpectedBeverage(
      //     testBeverages[bevId - 1])
      //   console.log(expectedBeverage)
      //   return supertest(app)
      //     .get(`/beverages/${bevId}`)
      //     .expect(200, expectedBeverage)
      // })
    })
  })

   describe(`POST /beverages`, () => {
    context('Given there are beverages in the database', () => {
      const testBeverages = helpers.makeBeveragesArray()
      beforeEach('insert beverages', () => {
          return db
              .into('sip_rate_beverages')
              .insert(testBeverages)
      })
    })

    //  it(`creates a beverage responding with 201 and the new beverage`, () =>{
    //    const newBeverage = {
    //       id: 1,
    //       bev_type: 'Bev Type 1',
    //       bev_name: 'Test Bev 1',
    //       description: 'Test description 1',
    //       overall_rating: 1
    //    }

    //    return supertest(app)
    //     .post('/beverages')
    //     .send(newBeverage)
    //     .expect(201)
    //     .expect(res => {
    //       expect(res.body.bev_type).to.eql(newBeverage.bev_type)
    //       expect(res.body.bev_name).to.eql(newBeverage.bev_name)
    //       expect(res.body.user_review).to.eql(newBeverage.user_review)
    //       expect(res.body.rating).to.eql(newBeverage.rating)
    //       expect(res.body).to.have.property('id')
    //       expect(res.headers.location).to.eql(`/beverages/${res.body.id}`)
    //     })
    //     .then(res =>
    //       supertest(app)
    //         .get(`/beverages/${res.body.id}`)
    //         .expect(res.body)
    //     )
    //  })

   })
})
