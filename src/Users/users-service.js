const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/

const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('sip_rate_users')
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password needs to be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hasUserWithUserName(db, user_name) {
        return db('sip_rate_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('sip_rate_users')
            .returning('*')
            .then(([user]) => user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    deleteUser(knex, id) {
        return knex('sip_rate_users')
            .where({ id })
            .delete()
    },
    getById(knex, id) {
        return knex.from('sip_rate_users').select('*').where('id', id).first()
    },
    updateUserInfo(knex, id, newUserFields) {
        return knex('sip_rate_users')
            .where({ id })
            .update(newUserFields)
    },
    

}

module.exports = UsersService