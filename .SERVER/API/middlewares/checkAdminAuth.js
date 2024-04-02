const jwt = require("jsonwebtoken")
const verifyAdminToken = (req, res, next) => {
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
      if (req.userData.role === "admin") {
        return next()
      } else {
        return res.status(401).json({message: "Unauthorized!"})
      }
    }
  })
}

module.exports = verifyAdminToken
