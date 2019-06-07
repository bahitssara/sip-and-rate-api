require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const cardRouter = require('./Users/user-router')

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
// app.use(function validateBearerToken(req, res, next) {
//     const apiToken = process.env.API_KEY
//     const authToken = req.get('Authorization')
  
//     if (!authToken || authToken.split(' ')[1] !== apiToken) {
//       logger.error(`Unauthorized request to path: ${req.path}`); 
//       return res.status(401).json({ error: 'Unauthorized request' })
//     }
//     next()
//   })

app.use(cardRouter)

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