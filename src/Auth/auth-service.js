const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithEmail(db, email) {
      return db('sip_rate_users')
        .where({ email })
        .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject, 
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        })
    },
    verifyJwt(subject, token) {
      return jwt.verify(token, config.JWT_SECRET, {
        subject,
        expiresIn: config.JWT_EXPIRY,
        algorithms: ['HS256'],
      })
    },
    parseBasicToken(token) {
      //   return Buffer
      //     .from(token, 'base64')
      //     .toString()
      //     .split(':')
        let string = Buffer.from(token, 'base64').toString();
        console.log(string);
        let parts = string.split(':');
        console.log(parts);
        return parts;
      },
  }
  
  module.exports = AuthService