const express = require("express")
const router = express.Router()

const {
  getAllGenres,
  addGenre,
  deleteGenresById,
  getGenresByIds,
} = require("../controllers/genres")

router.get("/", getAllGenres)
router.patch("/getgenresbyids", getGenresByIds)
router.post("/add", addGenre)
router.delete("/deletegenresbyid/:genreid", deleteGenresById)

module.exports = router
