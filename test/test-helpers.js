const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: 'Test',
      last_name: 'User',
      email: 'testemail1@email.com',
      password: 'password1',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      first_name: 'Test',
      last_name: 'User',
      email: 'testemail2@email.com',
      password: 'password2',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      first_name: 'Test',
      last_name: 'User',
      email: 'testemail3@email.com',
      password: 'password3',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      first_name: 'Test',
      last_name: 'User',
      email: 'testemail4@email.com',
      password: 'password4',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeBeveragesArray() {
  return [
    {
      id: 1,
      bev_type: 'Bev Type 1',
      bev_name: 'Test Bev 1',
      description: 'Test description 1',
      overall_rating: 1,
      bev_code: 'apothicdark20124'
    },
    {
      id: 2,
      bev_type: 'Bev Type 2',
      bev_name: 'Test Bev 2',
      description: 'Test description 2',
      overall_rating: 2,
      bev_code: 'apothicdark20121'
    },
    {
      id: 3,
      bev_type: 'Bev Type 3',
      bev_name: 'Test Bev 3',
      description: 'Test description 3',
      overall_rating: 3,
      bev_code: 'apothicdark20122'
    },
    {
      id: 4,
      bev_type: 'Bev Type 4',
      bev_name: 'Test Bev 4',
      description: 'Test description 4',
      overall_rating: 4,
      bev_code: 'apothicdark20123'
    },
  ];
}

function makeReviewsArray() {
  return [
    {
      id: 1,
      bev_type: 'test type',
      bev_name: 'test name',
      user_review: 'First test review!',
      rating: 2,
      bev_id: 'apothicdark20124',
      user_id: 1,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      bev_type: 'test type',
      bev_name: 'test name',
      user_review: 'Second test review!',
      rating: 3,
      bev_id: 'apothicdark20121',
      user_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      bev_type: 'test type',
      bev_name: 'test name',
      user_review: 'Third test review!',
      rating: 1,
      bev_id: 'apothicdark20122',
      user_id: 3,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      bev_type: 'test type',
      bev_name: 'test name',
      user_review: 'Fourth test review!',
      rating: 5,
      bev_id: 'apothicdark20123',
      user_id: 4,
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ];
}

function makeExpectedBeverage(beverage) {
  return {
    id: beverage.id,
    bev_type: beverage.bev_type,
    bev_name: beverage.bev_name,
    description: beverage.user_review,
    overall_rating: beverage.overall_rating,
    bev_code: beverage.bev_code
  }
}

function makeExpectedBeverageReviews(users, bevId, reviews) {
  const expectedReviews = reviews
    .filter(review => review.bev_id === bevId)

  return expectedReviews.map(review => {
    const reviewUser = users.find(user => user.id === review.user_id)
    return {
      id: beverage.id,
      bev_type: beverage.bev_type,
      bev_name: beverage.bev_name,
      user_review: beverage.user_review,
      date_created: beverage.date_created,
      bev_code: beverage.bev_code,
      user: {
        id: reviewUser.id,
        first_name: reviewUser.first_name,
        last_name: reviewUser.last_name,
        email: reviewUser.email,
        date_created: reviewUser.date_created,
      }
    }
  })
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testBeverages = makeBeveragesArray()
  const testReviews = makeReviewsArray(testUsers, testBeverages)
  return { testUsers, testBeverages, testReviews }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      sip_rate_beverages,
      sip_rate_users,
      sip_rate_reviews
      RESTART IDENTITY CASCADE`
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('sip_rate_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('sip_rate_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedBeveragesTables(db, beverages, users, reviews = []) {
  return db.transaction(async trx => {
    // await seedUsers(trx, users)   
    await trx.into('sip_rate_beverages').insert(beverages)
    await trx.raw(
      `SELECT setval('sip_rate_beverages_id_seq', ?)`,
      [beverages[beverages.length - 1].id],
    )
  })

}


module.exports = {
  makeUsersArray,
  makeBeveragesArray,
  makeExpectedBeverage,
  makeExpectedBeverageReviews,
  makeReviewsArray,

  makeFixtures,
  cleanTables,
  seedBeveragesTables,
  seedUsers
}

