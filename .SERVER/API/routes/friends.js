const express = require("express")
const router = express.Router()

const {
  sendFriendRequest,
  respondToFriendRequest,
  getAllFriendRequestsByReceiverId,
  getAllFriendsByUserId,
  getAllFriendRequestsBySenderId,
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
  "/getAllFriendRequestsBySenderId/:senderId",
  getAllFriendRequestsBySenderId
)

router.get("/getAllFriendsByUserId/:userId", getAllFriendsByUserId)

router.delete("/deleteFriend/", deleteFriend)

// router.get("/friend-requests/:userId", getAllFriendRequests)

module.exports = router
