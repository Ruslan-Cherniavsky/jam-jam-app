const express = require("express")
const router = express.Router()
const {
  createJam,
  getAllJams,
  getAllJamsWithPagination,
  getJamsFiltered,
} = require("../controllers/jams")

// POST endpoint to create a new Jam
router.post("/create", createJam)
router.get("/getalljams", getAllJams)
router.get("/getalljams-paginate", getAllJamsWithPagination)
router.get("/getalljams-paginate-filtered", getJamsFiltered)

module.exports = router
