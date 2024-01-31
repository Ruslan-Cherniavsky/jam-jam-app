const jwt = require("jsonwebtoken")
const verifyToken = (req, res, next) => {
  const token = req?.headers?.authorization

  if (token === null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_KEY, (err, userDecoded) => {
    if (err) {
      return next({...err, status: 401, message: " User is not Authorized!"})
    } else {
      req.userData = userDecoded
      console.log("#################### req.user ######################")
      console.log(req.userData)
      console.log("#################### req.user ######################")
      return next()
    }
  })
}

module.exports = verifyToken
