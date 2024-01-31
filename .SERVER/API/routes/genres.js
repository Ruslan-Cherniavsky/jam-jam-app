const express = require("express")
const router = express.Router()
const verifyAdminToken = require("../middlewares/checkAdminAuth")
const verifyToken = require("../middlewares/checkAuth")

const {
  getAllGenres,
  addGenre,
  deleteGenresById,
} = require("../controllers/genres")

// router.get("/", verifyToken, getAllMusicalGeners);
// router.post("/add", verifyAdminToken, addMusicalGener);
// router.delete(
//   "/deleteMusicalGeners/:musicalGenerId",
//   verifyAdminToken,
//   deleteMusicalGenersById
// );

router.get("/", getAllGenres)
router.post("/add", addGenre)
router.delete("/deletegenresbyid/:genreid", deleteGenresById)

module.exports = router
