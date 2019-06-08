const express = require('express')

const beveragesRouter = express.Router()
const jsonBodyParser = express.json()

const beverages = [{
    'id':'1',
    'bev_type': 'wine',
    'bev_name':'Pinot Grigio',
    'description': 'A white wine',
    'overall_rating': '5',
}]

beveragesRouter
    .route('/beverages')
    .get((req,res) => {
        res.json(beverages)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { bev_type, bev_name, description, overall_rating } = req.body
        const newBeverage = { bev_type, bev_name, description, overall_rating }

        for (const [key, value] of Object.entries(newBeverage))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })
    })


module.exports = beveragesRouter