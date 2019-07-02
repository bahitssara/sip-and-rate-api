const BeveragesService = {
    getAllBeverages(knex) {
        return knex.select('*').from('sip_rate_beverages')
    },

    insertBeverages(db, newWine) {
        return db
            .insert(newWine)
            .into('sip_rate_beverages')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBeverages(knex, id) {
        return knex('sip_rate_beverages')
            .where({ id })
            .delete()
    },
    getById(knex, id) {
        return knex.from('sip_rate_beverages').select('*').where('id', id).first()
    },
}

module.exports = BeveragesService