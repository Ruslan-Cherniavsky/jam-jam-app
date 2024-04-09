const mongoose = require("mongoose")
const Jam = require("../models/jam")
const User = require("../models/user")

//-----------------------------------------------------------|
//                                                           |
//              Postman tests / admin function:
//                                                           |
//-----------------------------------------------------------|

//-----Get All (no paginate)

const getAllJams = async (req, res) => {
  try {
    const jams = await Jam.find()

    res.status(200).json(jams)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to retrieve jams"})
  }
}

//-----Delete by jam Id:

const deleteJamById = async (req, res) => {
  const jamId = req.params.jamId

  try {
    if (!mongoose.isValidObjectId(jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }

    const jam = await Jam.findById(jamId)

    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    await Jam.deleteOne({_id: jamId})

    return res.status(200).json({message: `Jam with id: ${jamId} deleted`})
  } catch (error) {
    console.error("Error deleting jam:", error)
    res.status(500).json({error})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                         Host jam:
//                                                           |
//-----------------------------------------------------------|

//-----Create jam

const createJam = async (req, res) => {
  try {
    const {
      img,
      jamName,
      hostedBy,
      jamDate,
      country,
      isoCode,
      city,
      region,
      type,
      entrance,
      tune,
      jamTime,
      status,
      jamDescription,
      genres,
      sharedInstruments,
      jammers,
      audience,
      reports,
    } = req.body

    const newJam = new Jam({
      img,
      jamName,
      hostedBy,
      jamDate,
      country,
      isoCode,
      city,
      region,
      type,
      entrance,
      tune,
      jamTime,
      status,
      jamDescription,
      genres,
      sharedInstruments,
      jammers,
      audience,
      reports,
    })

    const savedJam = await newJam.save()

    res.status(201).json(savedJam)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to create Jam"})
  }
}

//-----Edit hosted jam:

const updateJam = async (req, res) => {
  const jamId = req.params.jamid

  try {
    if (!mongoose.isValidObjectId(jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }

    const jam = await Jam.findById(jamId)

    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    await Jam.updateOne({_id: jamId}, req.body)
    await jam.save()

    return res.status(200).json({message: "Jam updated"})
  } catch (error) {
    console.error("Error updating jam:", error)
    res.status(500).json({error})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                      Explore james:
//                                                           |
//-----------------------------------------------------------|

//-------Get All:

const getAllJamsWithPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12

  try {
    const totalJams = await Jam.countDocuments()
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

    return res.status(200).json({jams, totalPages})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to retrieve jams with pagination"})
  }
}

//-------Filter:

const getJamsFiltered = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12
  const params = req.query

  try {
    const queryConditions = {}

    if (params.genres && params.genres.length > 0) {
      queryConditions.genres = {
        $all: params.genres.map((id) => mongoose.Types.ObjectId(id)),
      }
    }

    if (params.sharedInstruments && params.sharedInstruments.length > 0) {
      queryConditions.sharedInstruments = {
        $all: params.sharedInstruments.map((id) => mongoose.Types.ObjectId(id)),
      }
    }

    if (params.instruments && params.instruments.length > 0) {
      queryConditions["jammers.instrument"] = {
        $all: params.instruments.map((id) => mongoose.Types.ObjectId(id)),
      }
    }

    if (params.country) {
      queryConditions.country = params.country
    }

    if (params.region) {
      queryConditions.region = params.region
    }

    if (params.city) {
      queryConditions.city = params.city
    }

    //----

    if (params.type) {
      queryConditions.city = params.type
    }

    if (params.entrance) {
      queryConditions.city = params.entrance
    }

    if (params.tune) {
      queryConditions.city = params.tune
    }

    //----

    if (Object.keys(queryConditions).length === 0) {
      return res.status(400).json({error: "No search conditions provided."})
    }

    const totalJams = await Jam.countDocuments(queryConditions)
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find(queryConditions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

    return res.json({jams, totalPages})
  } catch (error) {
    console.error("Error filtering jams:", error)
    res.status(500).json({error})
  }
}

//-------Search:

const getJamByJamName = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12
  const searchText = req.query.jamName

  try {
    const totalJams = await Jam.countDocuments({
      jamName: {$regex: new RegExp(searchText, "i")},
    })
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find({
      jamName: {$regex: new RegExp(searchText, "i")},
    })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

    return res.json({jams, totalPages})
  } catch (error) {
    console.error("Error searching jams by jam name:", error)
    res.status(500).json({error: "Internal server error."})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                     Hosted james:
//                                                           |
//-----------------------------------------------------------|

//-----Get all by hosted Id:

const getAllJamsByHostedById = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12
  const userId = req.params.userId

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({error: "Invalid user ID"})
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({message: "User not found."})
    }

    const queryConditions = {hostedBy: userId}

    const totalJams = await Jam.countDocuments(queryConditions)
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find(queryConditions)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

      .skip((page - 1) * perPage)
      .limit(perPage)
    // .populate("hostedBy genres sharedInstruments jammers.instrument audience reports.reporter");

    return res.status(200).json({jams, totalPages})
  } catch (error) {
    console.error("Error fetching jams by hosted user ID:", error)
    res.status(500).json({error: "Internal server error."})
  }
}

//-----------------------------------------------------------|
//                                                           |
//                          Jam Card:
//                                                           |
//-----------------------------------------------------------|

//-------Get jam card data by Id:

const getJamById = async (req, res) => {
  const jamId = req.params.jamid

  try {
    if (!mongoose.isValidObjectId(jamId)) {
      return res.status(400).json({error: "Invalid jam ID"})
    }

    const jam = await Jam.findById(jamId)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate({
        path: "jammers.jammersId",
        select: "_id userName img",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

    if (!jam) {
      return res.status(404).json({message: "Jam not found!"})
    }

    return res.status(200).json({jam})
  } catch (error) {
    console.error("Error fetching jam by ID:", error)
    res.status(500).json({error})
  }
}

//-----Report jam:

const reportJam = async (req, res) => {
  try {
    const {reportedJamId, userId, reason} = req.body

    const jam = await Jam.findById(reportedJamId)
    if (!jam) {
      return res.status(404).json({message: "Reported jam not found."})
    }

    jam.reports.push({
      reporter: userId,
      reason,
    })

    await jam.save()

    res.status(200).json({message: "Jam reported successfully."})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Internal server error."})
  }
}

//-----------------------------------------------------------|
//                                                           |
//         Joined james / jams info for Jammer Card:
//                                                           |
//-----------------------------------------------------------|

// get all jams by jammer Id (id from jammer card)

const getAllJamsByJammerId = async (req, res) => {
  const userId = req.params.userId
  const page = parseInt(req.query.page) || 1
  const perPage = 10 // Adjust as needed

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({error: "Invalid user ID"})
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({message: "User not found."})
    }
    const totalCount = await Jam.countDocuments({"jammers.jammersId": userId})
    const totalPages = Math.ceil(totalCount / perPage)

    const jams = await Jam.find({"jammers.jammersId": userId})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate({
        path: "hostedBy",
        select: "_id userName",
      })
      .populate({
        path: "audience",
        select: "_id userName",
      })
      .populate("genres sharedInstruments jammers.instrument reports.reporter")

    res.status(200).json({jams, totalPages})
  } catch (error) {
    console.error("Error fetching jams by jammer ID:", error)
    res.status(500).json({error: "Internal server error"})
  }
}

module.exports = {
  createJam,
  getAllJams,
  getAllJamsWithPagination,
  getJamsFiltered,
  getJamById,
  updateJam,
  deleteJamById,
  reportJam,
  getAllJamsByHostedById,
  getJamByJamName,
  getAllJamsByJammerId,
}
