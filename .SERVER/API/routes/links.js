const express = require("express")
const router = express.Router()

const {getAllLinks, addLink, deleteLinksById} = require("../controllers/links")

router.get("/", getAllLinks)
router.post("/add", addLink)
router.delete("/deletelinksbyid/:linkid", deleteLinksById)

module.exports = router
