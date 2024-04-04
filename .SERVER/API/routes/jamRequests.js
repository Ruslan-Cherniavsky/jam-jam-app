const express = require("express")
const router = express.Router()

const {
  sendJamRequest,
  respondToJamRequest,
  sendToFriendJamRequest,
} = require("../controllers/jamRequests")

router.post("/sendjamrequest", sendJamRequest)
router.post("/sendtofriendjamrequest", sendToFriendJamRequest)
router.post("/respondtojamRequest", respondToJamRequest)

module.exports = router
