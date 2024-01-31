const express = require("express")
const router = express.Router()
const verifyAdminToken = require("../middlewares/checkAdminAuth")
const verifyToken = require("../middlewares/checkAuth")

const {
  getAllInstruments,
  addInstrument,
  deleteInstrumentById,
} = require("../controllers/instruments")

// router.get("/", verifyToken, getAllMusicalInstruments);
// router.post("/add", verifyAdminToken, addMusicalInstrument);
// router.delete(
//   "/deleteMusicalInstruments/:musicalInstrumentId",
//   verifyAdminToken,
//   deleteMusicalInstrumentsById
// );

router.get("/", getAllInstruments)
router.post("/add", addInstrument)
router.delete("/deleteinstrumentbyid/:instrumentid", deleteInstrumentById)

module.exports = router
