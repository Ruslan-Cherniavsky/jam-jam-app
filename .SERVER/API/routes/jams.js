const express = require("express")
const router = express.Router()
const {
  createJam,
  getAllJams,
  getAllJamsWithPagination,
  getJamsFiltered,
  getJamById,
  updateJam,
  deleteJamById,
  reportJam,
  getAllJamsByHostedById,
  getJamByJamName,
} = require("../controllers/jams")

// POST endpoint to create a new Jam
router.post("/create", createJam)
router.get("/getalljams", getAllJams)
router.get("/getalljams-paginate", getAllJamsWithPagination)
router.get("/getalljams-paginate-filtered", getJamsFiltered)
router.get("/getjambyid/:jamid", getJamById)
router.patch("/updatejam/:jamid", updateJam)
router.delete("/deletebyid/:jamid", deleteJamById)
router.post("/reportjam/", reportJam)
router.get("/getalljamsbyhostedbyid/:userId", getAllJamsByHostedById)
router.get("/getjambyjamname", getJamByJamName)

module.exports = router
