const express = require('express')
const ReviewsService = require('./reviews-service')
const xss = require('xss')
const logger = require('../logger')
const { requireAuth } = require('../middleware/basic-auth')

const reviewRouter = express.Router()
const jsonBodyParser = express.json()

const serializeReview = review => ({
    id: review.id,
    bev_type: xss(review.bev_type),
    bev_name: xss(review.bev_name),
    user_review: xss(review.user_review),
    rating: review.rating,
    date_created: review.date_created,
    bev_id: review.bev_id || {},
    user_id: review.user_id || {},
})

reviewRouter
    .route('/reviews')
    .get((req, res, next) => {
        ReviewsService.getAllReviews(req.app.get('db'))
            .then(review => {
                res.json(review.map(serializeReview))
            })
            .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const newReview = { ...req.body, date_created: 'now()' }


        for (const [key, value] of Object.entries(newReview))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        newReview.user_id = req.user.id

        return ReviewsService
            .insertReview(req.app.get('db'), newReview)
            .then(newReview => {
                res
                    .status(201)
                    .location(`/reviews/${newReview.id}`)
                    .json(newReview)
            })
            .catch(next)
    })

reviewRouter
    .route('/reviews/:id')
    .all(requireAuth, (req, res, next) => {
        const { id } = req.params;
        ReviewsService.getById(req.app.get('db'), id)
            .then(review => {
                if (!review) {
                    logger.info(`Review with id ${id} doesn't exists`);
                    return res
                        .status(404)
                        .send({ error: { message: `Review doesn't exist` } })
                }
                res.review = review
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeReview(res.review))
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const updatedReview = { ...req.body, date_created: 'now()' }
        for (const [key, value] of Object.entries(updatedReview)) {
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        }
        return ReviewsService.updateReview(
            req.app.get('db'),
            req.params.id,
            updatedReview
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const { id } = req.params;
        ReviewsService.deleteReview(
            req.app.get('db'),
            id
        )
            .then(numRowsAffected => {
                logger.info(`Review with id ${id} doesn't exist`)
                res.status(204).end()
            })
            .catch(next)
    })

reviewRouter
    .route('/myreviews/:userid')
    .get((req, res, next) => {
        const { userid } = req.params;
        ReviewsService.getUserReviews(req.app.get('db'), userid)
            .then(review => {
                if (!review) {
                    logger.info(`User with id ${userid} doesn't exists`);
                    return res
                        .status(409)
                        .send({ error: { message: `User reviews don't exist` } })
                }
                res.status(200).json(review)
            })
            .catch(next)
    })





module.exports = reviewRouter

