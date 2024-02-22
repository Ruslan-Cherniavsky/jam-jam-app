const express = require("express")
const router = express.Router()
const verifyAdminToken = require("../middlewares/checkAdminAuth")
const verifyToken = require("../middlewares/checkAuth")

const {getAllLinks, addLink, deleteLinksById} = require("../controllers/links")

// router.get("/", verifyToken, getAllMusicalGeners);
// router.post("/add", verifyAdminToken, addMusicalGener);
// router.delete(
//   "/deleteMusicalGeners/:musicalGenerId",
//   verifyAdminToken,
//   deleteMusicalGenersById
// );

router.get("/", getAllLinks)
router.post("/add", addLink)
router.delete("/deletelinksbyid/:linkid", deleteLinksById)

module.exports = router
