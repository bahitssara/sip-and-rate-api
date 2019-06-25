const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth') 

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .route('/login')
    .post(jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body
        const loginUser = { email, password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        AuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                if (!dbUser)
                    return res.status(400).json({
                        error: 'Incorrect email',
                    })
                    .catch(next)

                 return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch)
                            return res.status(400).json({
                                error: 'Incorrect password',
                            })

                        const sub = dbUser.email
                        const payload = { user_id: dbUser.id }
                        res.send({
                            authToken: AuthService.createJwt(sub, payload)
                        })
                    })
            })
            .catch(next)
    })


module.exports = authRouter
