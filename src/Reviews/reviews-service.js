const ReviewsService = {
    getAllReviews(knex) {
        return knex
            .select(
                'sip_rate_reviews.id',
                'sip_rate_reviews.bev_type',
                'sip_rate_reviews.bev_name',
                'sip_rate_reviews.user_review',
                'sip_rate_reviews.rating',
                'sip_rate_reviews.date_created',
                'sip_rate_reviews.bev_id',
                'sip_rate_reviews.user_id'
            )
            .from('sip_rate_reviews')
            .join('sip_rate_users', {'sip_rate_users.id': 'sip_rate_reviews.user_id'})
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
    },
}
    


module.exports = ReviewsService