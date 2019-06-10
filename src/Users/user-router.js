const express = require('express')
const path = require('path')
const logger = require('../logger')
const UsersService = require('./users-service')
const xss = require('xss')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
    id: user.id,
    first_name: xss(user.first_name),
    last_name: xss(user.last_name),
    user_name: xss(user.user_name),
    email: xss(user.email),
    date_created: new Date(user.date_created),
}) 

usersRouter
    .route('/user')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })

    .post(jsonBodyParser, (req, res, next) => {
        const newUser = {...req.body, date_created: 'now()'}
        for (const field of ['first_name', 'last_name', 'user_name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }
        const passwordError = UsersService.validatePassword(newUser.password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }
        newUser.password = UsersService.hashPassword(newUser.password)
                                .then(hashedPassword => hashedPassword)
                                
        return UsersService
                    .insertUser(req.app.get('db'), newUser)
                        .then(newUser => {
                            res
                            .status(201)
                            .json(newUser)
                        })
                        
                        .catch(next)
    })
            

usersRouter
    .route('/user/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        UsersService.getById(req.app.get('db'), id)
            .then(user => {
                if (!user) {
                    logger.info(`User with id:${id} doesn't exist`);
                    return res
                        .status(404)
                        .send({ error: { message: `User doesn't exist` } })
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializeUser(res.user))
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const updatedUserInfo = {...req.body, date_created: 'now()'}
        for (const [key, value] of Object.entries(updatedUserInfo)) {
            if (value == null)
                return res.status(400).json({
                error: `Missing '${key}' in request body`
                })
        }
        return UsersService.updateUserInfo(
            req.app.get('db'),
            req.params.id,
            updatedUserInfo
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .delete((req, res, next) => {
        const { id } = req.params;
        UsersService.deleteUser(
            req.app.get('db'),
            id
        )
        .then(numRowsAffected => {
            logger.info(`User with id ${id} deleted`)
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = usersRouter
