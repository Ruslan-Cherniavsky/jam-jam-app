const express = require("express")
const router = express.Router()

const {
  sendJamRequest,
  respondToJamRequest,
  inviteToJam,
  getAllJamRequests,
  getAllJamRequestsPaginate,
  getAllJamRequestsByReceiverIdPaginate,
  deleteJamRequestsById,
  getAllJammersFromJamRequestsByHostedIdPaginate,
  getAllJamRequestsByIds,

  // getAllJamRequestsByReceiverIdAndSenderIdPaginate,
} = require("../controllers/jamRequests")

router.post("/sendjamrequest", sendJamRequest)
router.post("/invitetojam", inviteToJam)
router.post("/respondtojamrequest", respondToJamRequest)

router.get("/getalljamrequests", getAllJamRequests)
router.get("/getalljamrequestspaginate", getAllJamRequestsPaginate)

router.get("/getalljamrequestsbyids", getAllJamRequestsByIds)

router.delete("/deletejamrequestsbyid/:jamRequestId", deleteJamRequestsById)

router.get(
  "/getalljamrequestsbyreceiveridpaginate",
  getAllJamRequestsByReceiverIdPaginate
)

router.get(
  "/getalljammersfromjamrequestsbyhostedidpaginate",
  getAllJammersFromJamRequestsByHostedIdPaginate
)

module.exports = router
