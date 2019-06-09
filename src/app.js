require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const usersRouter = require('./Users/user-router')
const reviewRouter = require('./Reviews/reviews-router')
const beveragesRouter = require('./Beverages/beverages-router')
const authRouter = require('./Auth/auth-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(helmet())

app.use(usersRouter)
app.use(reviewRouter)
app.use(authRouter)
app.use(beveragesRouter)

app.get('/', (req,res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error: { message: 'server error'}}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    next()
})
module.exports = app