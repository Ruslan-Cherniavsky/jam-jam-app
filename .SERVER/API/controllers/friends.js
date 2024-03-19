const mongoose = require("mongoose")
const User = require("../models/user")
const FriendRequest = require("../models/friends")

const sendFriendRequest = async (req, res) => {
  const {senderId, receiverId} = req.body

  try {
    const existingRequest = await FriendRequest.findOne({senderId, receiverId})

    if (existingRequest) {
      return res.status(400).json({message: "Friend request already sent."})
    }

    const newRequest = new FriendRequest({senderId, receiverId})
    await newRequest.save()

    return res
      .status(200)
      .json({message: "Friend request sent successfully.", request: newRequest})
  } catch (error) {
    console.error("Error sending friend request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const respondToFriendRequest = async (req, res) => {
  const {requestId, status} = req.body

  try {
    const request = await FriendRequest.findById(requestId).populate([
      {path: "senderId", select: "_id userName"},
      {path: "receiverId", select: "_id userName"},
    ])

    if (!request) {
      return res.status(404).json({message: "Friend request not found."})
    }

    if (status === "approved") {
      // Add users to each other's friend lists
      await Promise.all([
        User.findByIdAndUpdate(request.senderId, {
          $push: {friends: request.receiverId},
        }),
        User.findByIdAndUpdate(request.receiverId, {
          $push: {friends: request.senderId},
        }),
      ])
      await FriendRequest.findByIdAndDelete(requestId)
    }

    if (status === "rejected") {
      await FriendRequest.findByIdAndDelete(requestId)
    }

    // request.status = status
    // await request.save()

    return res
      .status(200)
      .json({message: "Friend request responded successfully.", request})
  } catch (error) {
    console.error("Error responding to friend request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const getAllFriendRequestsByReceiverId = async (req, res) => {
  const {receiverId} = req.params

  // console.log(receiverId)
  try {
    // Find all friend requests where the receiverId matches

    const friendRequests = await FriendRequest.find({receiverId}).populate([
      {
        path: "senderId",
        populate: {path: "instruments genres"},
      },
      {path: "receiverId", select: "_id userName"},
    ])

    // if (!friendRequests || friendRequests.length === 0) {
    //   return res
    //     .status(404)
    //     .json({message: "No friend requests found for the user."})
    // }

    return res.status(200).json({friendRequests})
  } catch (error) {
    console.error("Error retrieving friend requests:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}
const getAllFriendRequestsByReceiverIdPaginate = async (req, res) => {
  const {receiverId} = req.params
  const page = parseInt(req.query.page) || 1
  const perPage = 8 // TODO ---- change it to 12

  // console.log(receiverId)
  try {
    const totalUsers = await FriendRequest.find({receiverId}).countDocuments()
    const totalPages = Math.ceil(totalUsers / perPage)

    // Find all friend requests where the receiverId matches

    const friendRequests = await FriendRequest.find({receiverId})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate([
        {
          path: "senderId",
          populate: {path: "instruments genres"},
        },
        {path: "receiverId", select: "_id userName"},
      ])

    // if (!friendRequests || friendRequests.length === 0) {
    //   return res
    //     .status(404)
    //     .json({message: "No friend requests found for the user."})
    // }

    return res.status(200).json({friendRequests, totalPages})
  } catch (error) {
    console.error("Error retrieving friend requests:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const getAllFriendRequestsBySenderId = async (req, res) => {
  const {senderId} = req.params

  try {
    // Find all friend requests where the receiverId matches
    const friendRequests = await FriendRequest.find({senderId}).populate([
      {path: "senderId", select: "_id userName"},
      {path: "receiverId", select: "_id userName"},
    ])

    // if (!friendRequests || friendRequests.length === 0) {
    //   return res
    //     .status(404)
    //     .json({message: "No friend requests found for the user."})
    // }

    return res.status(200).json({friendRequests})
  } catch (error) {
    console.error("Error retrieving friend requests:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const getAllFriendRequestsBySenderIdPaginate = async (req, res) => {
  const {senderId} = req.params
  const page = parseInt(req.query.page) || 1
  const perPage = 8 // TODO ---- change it to 12
  try {
    const totalUsers = await FriendRequest.find({receiverId}).countDocuments()
    const totalPages = Math.ceil(totalUsers / perPage)

    // Find all friend requests where the receiverId matches
    const friendRequests = await FriendRequest.find({senderId})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate([
        {path: "senderId", select: "_id userName"},
        {path: "receiverId", select: "_id userName"},
      ])

    if (!friendRequests || friendRequests.length === 0) {
      return res
        .status(404)
        .json({message: "No friend requests found for the user."})
    }

    return res.status(200).json({friendRequests, totalPages})
  } catch (error) {
    console.error("Error retrieving friend requests:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const getAllFriendsByUserIdPaginate = async (req, res) => {
  const {userId} = req.params
  const page = parseInt(req.query.page) || 1
  const perPage = 8 // TODO ---- change it to 12

  try {
    const user = await User.findById(userId).populate({
      path: "friends",
      populate: {path: "instruments genres"},
    })

    if (!user) {
      return res.status(404).json({message: "User not found"})
    }

    const friends = user.friends.slice((page - 1) * perPage, page * perPage)

    return res
      .status(200)
      .json({friends, totalPages: Math.ceil(user.friends.length / perPage)})
  } catch (error) {
    console.error("Error retrieving friends:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const deleteFriend = async (req, res) => {
  const {userId, friendId} = req.body

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: {friends: friendId},
    })

    console.log(userId, friendId, req.params)

    await User.findByIdAndUpdate(friendId, {
      $pull: {friends: userId},
    })

    return res.status(200).json({message: "Friend deleted successfully."})
  } catch (error) {
    console.error("Error deleting friend:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
  getAllFriendRequestsByReceiverId,
  getAllFriendRequestsByReceiverIdPaginate,
  getAllFriendRequestsBySenderId,
  getAllFriendRequestsBySenderIdPaginate,
  getAllFriendsByUserIdPaginate,
  deleteFriend,
}
