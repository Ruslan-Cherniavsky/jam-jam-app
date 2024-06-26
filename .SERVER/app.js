const express = require("express")
const app = express()

const morgan = require("morgan")
const cors = require("cors")
// const verifyToken = require("./API/middlewares/checkAuth")

app.use(morgan("dev"))
app.use(cors({origin: "*"}))
const bodyParser = require("body-parser")
app.use(bodyParser.json())
require("dotenv").config()
const mongoose = require("mongoose")
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ruslan-test.odepovq.mongodb.net/Jam-app?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conected to data base Woohoo!")
  })
  .catch(() => {
    console.log("Conection failed! T___T")
  })

const usersRoutes = require("./API/routes/users")
const friendsRoutes = require("./API/routes/friends")
const genresRoutes = require("./API/routes/genres")
const instrumentsRoutes = require("./API/routes/instruments")
const links = require("./API/routes/links")
const jams = require("./API/routes/jams")
const jamRequests = require("./API/routes/jamRequests")

app.use("/users", usersRoutes)

app.use("/friends", friendsRoutes)

app.use("/genres", genresRoutes)

app.use("/instruments", instrumentsRoutes)

app.use("/links", links)

app.use("/jams", jams)

app.use("/jamrequests", jamRequests)

// app.use(verifyToken);

// app.get("/usercheck", checkUserAutchData);

app.get("/usercheck")

app.use((req, res, next) => {
  const error = new Error("Not Found!")
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
