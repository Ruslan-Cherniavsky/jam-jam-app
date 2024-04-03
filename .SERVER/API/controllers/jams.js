const mongoose = require("mongoose")
const Jam = require("../models/jam")

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

const getAllJams = async (req, res) => {
  try {
    const jams = await Jam.find()

    res.status(200).json(jams)
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to retrieve jams"})
  }
}

const getAllJamsWithPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12

  try {
    const totalJams = await Jam.countDocuments()
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
    // .populate(
    //   "hostedBy genres sharedInstruments jammers.instrument audience reports.reporter"
    // )

    return res.status(200).json({jams, totalPages})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Failed to retrieve jams with pagination"})
  }
}

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

    if (Object.keys(queryConditions).length === 0) {
      return res.status(400).json({error: "No search conditions provided."})
    }

    const totalJams = await Jam.countDocuments(queryConditions)
    const totalPages = Math.ceil(totalJams / perPage)

    const jams = await Jam.find(queryConditions)
      .skip((page - 1) * perPage)
      .limit(perPage)
    // .populate(
    //   "hostedBy genres sharedInstruments jammers.instrument audience reports.reporter"
    // )

    return res.json({jams, totalPages})
  } catch (error) {
    console.error("Error filtering jams:", error)
    res.status(500).json({error})
  }
}

module.exports = {
  createJam,
  getAllJams,
  getAllJamsWithPagination,
  getJamsFiltered,
}
