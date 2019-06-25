const AuthService = require('../Auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('authorization') || ''
  const email = req.get('email')

    let basicToken;

  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token' })
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }
  const isAuthenticated = AuthService.verifyJwt(email, basicToken)

  if (!isAuthenticated) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  req.app.get('db')('sip_rate_users')
    .where({ email })
    .first()
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request' })
      }
      next()
    })
    .catch(next)
}


module.exports = {
  requireAuth,
}