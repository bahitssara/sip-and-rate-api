const ReviewsService = {
    getAllReviews(knex) {
        return knex
            .select(
                'reviews.id',
                'reviews.bev_type',
                'reviews.bev_name',
                'reviews.rating',
                'reviews.date_created',
                'reviews.bev_id',
                'reviews.user_id'
            )
            .from('sip_rate_reviews')
            .join('users', {'users.id': 'reviews.user_id'})
    },
    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('sip_rate_reviews')
            .returning('*')
            .then(([review]) => review)
    }, 
    deleteReview(knex, id) {
        return knex('sip_rate_reviews')
          .where({ id })
          .delete()
    },
    getById(db, id) {
        return db
            .from('sip_rate_reviews')
            .select('*')
            .where('id', id)
            .first()
    },
    updateReview(knex, id, newReviewFields) {
        return knex('sip_rate_reviews')
            .where({ id })
            .update(newReviewFields)
    }
}

module.exports = ReviewsService