const express = require("express")
const router = express.Router()

const {
  getAllInstruments,
  addInstrument,
  deleteInstrumentById,
  getInstrumentsByIds,
} = require("../controllers/instruments")

router.get("/", getAllInstruments)
router.patch("/getinstrumentsbyids", getInstrumentsByIds)
router.post("/add", addInstrument)
router.delete("/deleteinstrumentbyid/:instrumentid", deleteInstrumentById)

module.exports = router
