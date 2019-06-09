const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/user')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })
    // .post(jsonBodyParser, (req, res) => {
    //     const { first_name, last_name, user_name, email, password } = req.body

    //     for (const field of ['first_name', 'last_name', 'user_name', 'email', 'password'])
    //         if (!req.body[field])
    //             return res.status(400).json({
    //             error: `Missing '${field}' in request body`
    //             })
    //         const passwordError = UsersService.validatePassword(password)

    //         if(!passwordError)
    //             return res.status(400).json({ error: passwordError })
            
    //         UsersService.hasUserWithUserName(
    //             req.app.get('db'),
    //             user_name
    //         )
    //         .then(hasUserWithUserName => {
    //             if(hasUserWithUserName)
    //             return res.status(400).json({ error: `Username already taken` })
        
    //             return UsersService.hashPassword(password)
    //                 .then(hashedPassword => {
    //                     const newUser = {
    //                         first_name,
    //                         last_name,
    //                         user_name,
    //                         email,
    //                         password: hashedPassword,
    //                         date_created: 'now()',
    //                         }
    //                         return UsersService.insertUser(
    //                             req.app.get('db'),
    //                             newUser
    //                           )
    //                             .then(user => {
    //                               res
    //                                 .status(201)
    //                                 .location(path.posix.join(req.originalUrl, `/${user.id}`))
    //                                 .json(UsersService.serializeUser(user))
    //                             })
    //                 })
    //         })
    // })

    module.exports = usersRouter
