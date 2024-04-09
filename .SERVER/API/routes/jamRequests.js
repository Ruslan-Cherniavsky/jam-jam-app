const express = require("express")
const router = express.Router()

const {
  sendJamRequest,
  respondToJamRequest,
  sendToFriendJamRequest,
  getAllJamRequests,
  getAllJamRequestsPaginate,
  getAllJamRequestsByReceiverIdPaginate,
  deleteJamRequestsById,
  getAllJammersFromJamRequestsByHostedIdPaginate,

  getAllJamRequestsByReceiverIdAndSenderIdPaginate,
} = require("../controllers/jamRequests")

router.post("/sendjamrequest", sendJamRequest)
router.post("/sendtofriendjamrequest", sendToFriendJamRequest)
router.post("/respondtojamrequest", respondToJamRequest)

router.get("/getalljamrequests", getAllJamRequests)
router.get("/getalljamrequestspaginate", getAllJamRequestsPaginate)

router.delete("/deletejamrequestsbyid/:jamRequestId", deleteJamRequestsById)

router.get(
  "/getalljamrequestsbyreceiveridpaginate",
  getAllJamRequestsByReceiverIdPaginate
)

router.get(
  "/getalljammersfromjamrequestsbyhostedidpaginate",
  getAllJammersFromJamRequestsByHostedIdPaginate
)

router.get(
  "/getalljamrequestsbyreceiveridandsenderidpaginate",
  getAllJamRequestsByReceiverIdAndSenderIdPaginate
)

module.exports = router
