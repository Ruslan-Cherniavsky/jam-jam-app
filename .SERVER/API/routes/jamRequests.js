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
  joinJam,

  // getAllJamRequestsByReceiverIdAndSenderIdPaginate,
} = require("../controllers/jamRequests")

router.post("/sendjamrequest", sendJamRequest)

router.post("/joinjam", joinJam)

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
  "/getalljammersfromjamrequestsbyhostedidpaginate/:userId",
  getAllJammersFromJamRequestsByHostedIdPaginate
)

module.exports = router
