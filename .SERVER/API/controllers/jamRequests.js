const mongoose = require("mongoose")
const {isValidObjectId} = require("mongoose")
const Jam = require("../models/jam")
const User = require("../models/user")
const JamRequests = require("../models/jamRequests")
const Instruments = require("../models/instruments")

//-----------------------------------------------------------|
//                                                           |
//              Postman tests / admin function:
//                                                           |
//-----------------------------------------------------------|

//---Get all jam requests

const getAllJamRequests = async (req, res) => {
  try {
    const jamRequests = await JamRequests.find()
    if (!jamRequests || jamRequests.length === 0) {
      return res.status(404).json({message: "No Jam Requests found"})
    }

    return res.status(200).json({jamRequests})
  } catch (error) {
    console.error("Error getting all Jam Requests requests:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

//---Get all jam requests paginate

const getAllJamRequestsPaginate = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12

  try {
    const totalJamRequests = await JamRequests.countDocuments()
    const totalPages = Math.ceil(totalJamRequests / perPage)

    const jamRequests = await JamRequests.find()
      .skip((page - 1) * perPage)
      .limit(perPage)

    if (!jamRequests || jamRequests.length === 0) {
      return res.status(404).json({message: "No jam requests found"})
    }

    return res.status(200).json({jamRequests, totalPages})
  } catch (error) {
    console.error("Error getting all jam requests:", error)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

//---Delete jam request by id

const deleteJamRequestsById = async (req, res) => {
  const jamRequestId = req.params.jamRequestId

  console.log(jamRequestId)
  try {
    const jamRequests = await JamRequests.findById(jamRequestId)

    if (!jamRequests) {
      return res.status(404).json({message: "Jam Requests not found!"})
    }
    await JamRequests.deleteOne({_id: jamRequestId})
    return res
      .status(200)
      .json({message: `Jam Requests id: ${jamRequestId} Deleted`})
  } catch (error) {
    console.error("Error deleting Jam Request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                     Send Jam Request:
//                                                           |
//-----------------------------------------------------------|

//-------Send Jam Request (user sending request for user):

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
      (jammer) => jammer.instrument.toString() === instrumentId
    )
    if (!isInstrument) {
      return res
        .status(400)
        .json({message: "This role in this jam is not exist anymore..."})
    }

    const isJammer = jam.jammers.some(
      (jammer) =>
        jammer.jammersId.includes(senderId) &&
        jammer.instrument.toString() === instrumentId
    )
    if (isJammer) {
      return res
        .status(400)
        .json({message: "You are already on this role in this jam."})
    }

    const isJammersNumberValid = jam.jammers.some(
      (jammer) =>
        jammer.maxNumberOfJammers > jammer.jammersId.length &&
        jammer.instrument.toString() === instrumentId
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

//--------Send Jam Request for friend (user sending request for friend):

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
      (jammer) => jammer.instrument.toString() === instrumentId
    )

    // const isInstrument = jam.jammers.some(
    //   (jammer) => jammer.instrument === instrumentId
    // )

    if (!isInstrument) {
      return res
        .status(400)
        .json({message: "this role in this jam is not exist anymore..."})
    }

    const isJammer = jam.jammers.some(
      (jammer) =>
        jammer.jammersId.includes(receiverId) &&
        jammer.instrument.toString() === instrumentId
    )
    if (isJammer) {
      return res
        .status(400)
        .json({message: "Yore friend already on this role in this jam."})
    }

    const isJammersNumberValid = jam.jammers.some(
      (jammer) =>
        jammer.maxNumberOfJammers > jammer.jammersId.length &&
        jammer.instrument.toString() === instrumentId
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

//-----------------------------------------------------------|
//                                                           |
//            Respond To Jam Requests (user & friend):
//                                                           |
//-----------------------------------------------------------|

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
          jammer.maxNumberOfJammers > jammer.jammersId.length &&
          jammer.instrument.toString() === request.instrumentId
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
  } catch (error) {
    console.error("Error responding to jam request:", error)
    return res.status(500).json({message: "Internal Server Error"})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                     Invites To Jam :
//                                                           |
//-----------------------------------------------------------|

//---Get all invites to jam by reciver Id:

const getAllJamRequestsByReceiverIdPaginate = async (req, res) => {
  // const receiverId = req.params.receiverId
  const {receiverId, senderId} = req.body

  if (senderId === receiverId) {
    return res
      .status(404)
      .json({message: "receiverId and senderId must be deferent"})
  }

  const page = parseInt(req.query.page) || 1
  const perPage = 12

  try {
    const totalJamRequests = await JamRequests.countDocuments({receiverId})
    const totalPages = Math.ceil(totalJamRequests / perPage)

    const jamRequests = await JamRequests.find({receiverId})
      .populate("senderId", "_id userName")
      .populate("receiverId", "_id userName")
      .populate("jamId")
      // .populate("instrumentId")
      .skip((page - 1) * perPage)
      .limit(perPage)

    if (!jamRequests || jamRequests.length === 0) {
      return res.status(404).json({message: "No jam requests found"})
    }

    return res.status(200).json({jamRequests, totalPages})
  } catch (error) {
    console.error("Error getting all jam requests:", error)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

//--- my requestts to join other james:

const getAllJamRequestsByReceiverIdAndSenderIdPaginate = async (req, res) => {
  // const receiverId = req.params.receiverId
  const {receiverId, senderId} = req.body

  const page = parseInt(req.query.page) || 1
  const perPage = 12

  if (senderId != receiverId) {
    return res.status(404).json({message: "receiverId and senderId must match"})
  }

  try {
    const totalJamRequests = await JamRequests.countDocuments({receiverId})
    const totalPages = Math.ceil(totalJamRequests / perPage)

    const jamRequests = await JamRequests.find({receiverId})
      .populate("senderId", "_id userName")
      .populate("receiverId", "_id userName")
      .populate("jamId")
      // .populate("instrumentId")
      .skip((page - 1) * perPage)
      .limit(perPage)

    if (!jamRequests || jamRequests.length === 0) {
      return res.status(404).json({message: "No jam requests found"})
    }

    return res.status(200).json({jamRequests, totalPages})
  } catch (error) {
    console.error("Error getting all jam requests:", error)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                     Requests To Jam:
//                                                           |
//-----------------------------------------------------------|

//----other jammers requests to join my james

//-----Get all jammers from jam requests by hosted ids from jams

const getAllJammersFromJamRequestsByHostedIdPaginate = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12
  // const userId = req.params.userId
  const {userId} = req.body // Corrected to use req.body

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({error: "Invalid user ID"})
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({message: "User not found."})
    }

    // console.log(userId)

    const jamsWithUserAsHost = await Jam.find({hostedBy: userId}).lean()
    if (!jamsWithUserAsHost || jamsWithUserAsHost.length === 0) {
      return res.status(404).json({message: "User has not hosted any jams."})
    }

    const totalJamRequests = await JamRequests.countDocuments({}).populate({
      path: "jamId",
      match: {hostedBy: userId}, // Filter based on the hostedBy field of the referenced jam
    })

    const totalPages = Math.ceil(totalJamRequests / perPage)

    const jamRequests = await JamRequests.find({})
      .populate({
        path: "jamId",
        match: {hostedBy: userId}, // Filter based on the hostedBy field of the referenced jam
      })
      // .populate("senderId receiverId")
      .populate("receiverId senderId")
      .skip((page - 1) * perPage)
      .limit(perPage)

    if (!jamRequests || jamRequests.length === 0) {
      return res.status(404).json({message: "No jam requests found"})
    }

    return res.status(200).json({jamRequests, totalPages})
  } catch (error) {
    console.error("Error getting all jam requests:", error)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

module.exports = {
  sendJamRequest,
  sendToFriendJamRequest,
  respondToJamRequest,

  getAllJamRequests,
  getAllJamRequestsPaginate,

  getAllJamRequestsByReceiverIdPaginate,
  getAllJamRequestsByReceiverIdAndSenderIdPaginate,

  deleteJamRequestsById,

  getAllJammersFromJamRequestsByHostedIdPaginate,
}
