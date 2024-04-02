const jwt = require("jsonwebtoken")

const checkUserAutchData = (req, res, next) => {
  const token = req?.headers?.authorization

  if (token === null) return res.status(401)
  jwt.verify(token, process.env.JWT_KEY, (err, userDecoded) => {
    if (err) {
      return res.status(401).json({message: " User is not Authorized!"})
    } else {
      req.userData = userDecoded
      return res.status(200).json(req.userData)
    }
  })
}

module.exports = checkUserAutchData
