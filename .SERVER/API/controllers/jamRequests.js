const mongoose = require("mongoose")
const {isValidObjectId} = require("mongoose")
const Jam = require("../models/jam")
const User = require("../models/user")
const JamRequests = require("../models/jamRequests")
const Instruments = require("../models/instruments")

const sendJamRequest = async (req, res) => {
  const {senderId, receiverId, jamId, instrumentId} = req.body

  try {
    if (!mongoose.isValidObjectId(senderId)) {
      return res.status(400).json({error: "Invalid sender ID"})
    }
    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({error: "Invalid receiver ID"})
    }
    if (!mongoose.isValidObjectId(jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }
    if (!mongoose.isValidObjectId(instrumentId)) {
      return res.status(400).json({error: "Invalid instrumentId ID"})
    }

    const sender = await User.findById(senderId)
    if (!sender) {
      return res.status(404).json({message: "Sender not found!"})
    }

    if (senderId !== receiverId) {
      return res.status(404).json({error: "senderId and receiverId must much!"})
    }

    const jam = await Jam.findById(jamId)
    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    const instrument = await Instruments.findById(instrumentId)
    if (!instrument) {
      return res.status(404).json({message: "Instrument not found!"})
    }

    //------

    const isInstrument = jam.jammers.some(
      (jammer) => jammer.instrument === instrumentId
    )
    if (!isInstrument) {
      return res
        .status(400)
        .json({message: "This role in this jam is not exist anymore..."})
    }

    const isJammer = jam.jammers.some(
      (jammer) =>
        jammer.jammersId.includes(senderId) &&
        jammer.instrument === instrumentId
    )
    if (isJammer) {
      return res
        .status(400)
        .json({message: "You are already on this role in this jam."})
    }

    const isJammersNumberValid = jam.jammers.some(
      (jammer) =>
        jammer.maxNumberOfJammers < jammer.jammersId.length &&
        jammer.instrument === instrumentId
    )

    if (!isJammersNumberValid) {
      return res.status(400).json({message: "This jammer role is full"})
    }

    //-----

    const existingRequest = await JamRequests.findOne({
      senderId,
      receiverId,
      jamId,
      instrumentId,
    })

    if (existingRequest) {
      return res.status(400).json({message: "You already sent Jam request."})
    }

    const newRequest = new JamRequests({
      senderId,
      receiverId,
      jamId,
      instrumentId,
    })
    await newRequest.save()

    return res
      .status(200)
      .json({message: "Jam request sent successfully.", request: newRequest})
  } catch (error) {
    console.error("Error sending Jam request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

const sendToFriendJamRequest = async (req, res) => {
  const {senderId, receiverId, jamId, instrumentId} = req.body

  try {
    if (!mongoose.isValidObjectId(senderId)) {
      return res.status(400).json({error: "Invalid sender ID"})
    }
    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({error: "Invalid receiver ID"})
    }
    if (!mongoose.isValidObjectId(jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }
    if (!mongoose.isValidObjectId(instrumentId)) {
      return res.status(400).json({error: "Invalid instrumentId ID"})
    }

    const sender = await User.findById(senderId)
    if (!sender) {
      return res.status(404).json({message: "Sender not found!"})
    }

    if (senderId === receiverId) {
      return res
        .status(404)
        .json({message: "senderId and receiverId have to be difirent"})
    }

    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({message: "Receiver not found!"})
    }

    const jam = await Jam.findById(jamId)
    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    const instrument = await Instruments.findById(instrumentId)
    if (!instrument) {
      return res.status(404).json({message: "Instrument not found!"})
    }

    //------

    const isInstrument = jam.jammers.some(
      (jammer) => jammer.instrument === instrumentId
    )
    if (!isInstrument) {
      return res
        .status(400)
        .json({message: "this role in this jam is not exist anymore..."})
    }

    const isJammer = jam.jammers.some(
      (jammer) =>
        jammer.jammersId.includes(receiverId) &&
        jammer.instrument === instrumentId
    )
    if (isJammer) {
      return res
        .status(400)
        .json({message: "Yore friend already on this role in this jam."})
    }

    const isJammersNumberValid = jam.jammers.some(
      (jammer) =>
        jammer.maxNumberOfJammers < jammer.jammersId.length &&
        jammer.instrument === instrumentId
    )

    if (!isJammersNumberValid) {
      return res.status(400).json({message: "This jammer roles is full"})
    }

    //-----

    const existingRequest = await JamRequests.findOne({
      senderId,
      receiverId,
      jamId,
      instrumentId,
    })

    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already sent invite to this user for this role in this Jam.",
      })
    }

    const newRequest = new JamRequests({
      senderId,
      receiverId,
      jamId,
      instrumentId,
    })
    await newRequest.save()

    return res
      .status(200)
      .json({message: "Jam invite sent successfully.", request: newRequest})
  } catch (error) {
    console.error("Error sending Jam request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

//------------

const respondToJamRequest = async (req, res) => {
  const {requestId, status} = req.body

  try {
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({error: "Invalid request ID"})
    }

    const request = await JamRequests.findById(requestId).populate([
      {path: "senderId", select: "_id userName"},
      {path: "receiverId", select: "_id userName"},
      {path: "jamId", select: "_id"},
      {path: "instrumentId", select: "_id"},
    ])

    if (!request) {
      return res.status(404).json({message: "Jam request not found."})
    }

    if (!mongoose.isValidObjectId(request.jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }

    if (!mongoose.isValidObjectId(request.instrumentId)) {
      return res.status(400).json({error: "Invalid instrumentId ID"})
    }

    if (!mongoose.isValidObjectId(request.receiverId)) {
      return res.status(400).json({error: "Invalid receiver ID"})
    }

    if (!mongoose.isValidObjectId(request.senderId)) {
      return res.status(400).json({error: "Invalid sender ID"})
    }

    //--

    const jam = await Jam.findById(request.jamId)
    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    const receiver = await User.findById(request.receiverId)
    if (!receiver) {
      return res.status(404).json({message: "Receiver not found!"})
    }

    const sender = await User.findById(request.senderId)
    if (!sender) {
      return res.status(404).json({message: "Sender not found!"})
    }

    const instrument = await Instruments.findById(request.instrumentId)
    if (!instrument) {
      return res.status(404).json({message: "Instrument not found!"})
    }

    if (!status) {
      return res.status(404).json({message: "Status not found!"})
    }

    if (status === "approved") {
      const isJammersNumberValid = jam.jammers.some(
        (jammer) =>
          jammer.maxNumberOfJammers < jammer.jammersId.length &&
          jammer.instrument === request.instrumentId
      )

      if (!isJammersNumberValid) {
        return res.status(400).json({message: "This jammer roles is full"})
      }

      await Jam.findByIdAndUpdate(
        request.jamId,
        {
          $push: {"jammers.$[elem].jammersId": request.receiverId},
        },
        {arrayFilters: [{"elem.instrument": request.instrumentId}]}
      )

      await JamRequests.deleteMany({
        jamId: request.jamId,
        instrumentId: request.instrumentId,
        receiverId: request.receiverId,
      })

      return res.status(200).json({
        message: `Jam request approved successfully. All Requests for that role in this jam, with required user is deleted.`,
        request,
      })
    }

    if (status === "rejected") {
      await JamRequests.findByIdAndDelete(requestId)

      return res.status(200).json({
        message: "Jam request rejected successfully. Request deleted:",
        request,
      })
    }

    return res.status(200).json({
      message: "Jam request responded successfully.",
      request,
    })
  } catch (error) {
    console.error("Error responding to jam request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

module.exports = {
  sendJamRequest,
  sendToFriendJamRequest,
  respondToJamRequest,
}
