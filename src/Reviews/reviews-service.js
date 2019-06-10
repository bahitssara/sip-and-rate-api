const ReviewsService = {
    getAllReviews(knex) {
        return knex.select('*').from('sip_rate_reviews')
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
    getById(knex, id) {
        return knex.from('sip_rate_reviews').select('*').where('id', id).first()
    },
}

module.exports = ReviewsService