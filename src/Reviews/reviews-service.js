const xss = require('xss')

const ReviewsService = {
    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('sip_rate_reviews')
            .returning('*')
            .then(([review]) => review)
    },

    serializedReview(review) {
        return {
            id: review.id,
            bev_name: review.bev_name,
            user_review: review.user_review,
            rating: rating.user_review,
            date_modified: rating.date_modified,
            bev_id: review.bev_id || {},
            user_id: review.user || {}
        }
    }
}

module.exports = ReviewsService