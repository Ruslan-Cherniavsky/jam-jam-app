const express = require("express")
const router = express.Router()

const {
  sendFriendRequest,
  respondToFriendRequest,
  getAllFriendRequestsByReceiverId,
  getAllFriendRequestsByReceiverIdPaginate,
  getAllFriendsByUserIdPaginate,
  getAllFriendRequestsBySenderId,
  getAllFriendRequestsBySenderIdPaginate,
  deleteFriend,
} = require("../controllers/friends")

router.post("/sendFriendRequest", sendFriendRequest)

router.post("/respondToFriendRequest", respondToFriendRequest)

//---

router.get(
  "/getAllFriendRequestsByReceiverId/:receiverId",
  getAllFriendRequestsByReceiverId
)
router.get(
  "/getAllFriendRequestsByReceiverIdPaginate/:receiverId",
  getAllFriendRequestsByReceiverIdPaginate
)
router.get(
  "/getAllFriendRequestsBySenderId/:senderId",
  getAllFriendRequestsBySenderId
)
router.get(
  "/getAllFriendRequestsBySenderIdPaginate/:senderId",
  getAllFriendRequestsBySenderIdPaginate
)

router.get(
  "/getAllFriendsByUserIdPaginate/:userId",
  getAllFriendsByUserIdPaginate
)

router.post("/deleteFriend/", deleteFriend)

// router.get("/friend-requests/:userId", getAllFriendRequests)

module.exports = router
