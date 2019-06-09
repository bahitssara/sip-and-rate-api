const express = require('express')
const path = require('path')

const reviewRouter = express.Router()
const jsonBodyParser = express.json()

const reviews = [{
    'id': '4',
    'bev_type':'beer',
    'bev_name':'Milk Stout',
    'user_review':'This beer was very good! Would have it again',
    'rating':'3',
    'date_created': '6/5/2019',
    'bev_id': '4',
    'user_id': '4'
}]

reviewRouter
    .route('/reviews')
    .get((req, res) => {
        res.json(reviews)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { bev_type, bev_name, user_review, rating } = req.body
        const newReview = { bev_type, bev_name, user_review, rating }

        for (const [key, value] of Object.entries(newReview))
            if (value == null)
                return res.status(400).json({
                error: `Missing '${key}' in request body`
                })
        
    // newReview.user_id = req.user.id
    // newReview.bev_id = req.beverage.id

    })

    module.exports = reviewRouter