const mongoose = require("mongoose")
const User = require("../models/user")
const Genres = require("../models/genres")

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12

  try {
    const totalUsers = await User.countDocuments()
    const totalPages = Math.ceil(totalUsers / perPage)

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("genres instruments")

    return res.status(200).json({users, totalPages})
  } catch (error) {
    res.status(500).json({error})
  }
}

const getUsersFiltered = async (req, res) => {
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

    if (params.instruments && params.instruments.length > 0) {
      queryConditions.instruments = {
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

    const totalUsers = await User.countDocuments(queryConditions)
    const totalPages = Math.ceil(totalUsers / perPage)

    const users = await User.find(queryConditions)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("genres instruments")

    return res.json({users, totalPages})
  } catch (error) {
    console.error("Error filtering users:", error)
    res.status(500).json({error})
  }
}

const getUsersByUsername = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = 12
  const searchText = req.query.username

  try {
    const totalUsers = await User.countDocuments({
      userName: {$regex: new RegExp(searchText, "i")},
    })
    const totalPages = Math.ceil(totalUsers / perPage)

    const users = await User.find({
      userName: {$regex: new RegExp(searchText, "i")},
    })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("genres instruments")

    return res.json({users, totalPages})
  } catch (error) {
    console.error("Error searching users by username:", error)
    res.status(500).json({error})
  }
}

const getUsernames = async (req, res) => {
  try {
    const usernames = await User.find({}, "userName")
    return res.status(200).json({usernames})
  } catch (error) {
    res.status(500).json({error})
  }
}

const getAllUsersByGenreId = async (req, res) => {
  const genreId = req.params.genreid

  try {
    const genre = await Genres.findById(genreId)

    if (!genre) {
      return res.status(404).json({message: "Music Genre not found! "})
    }
  } catch (error) {
    res.status(500).json({error})
  }
}

const getJemerCardDataById = async (req, res) => {
  const userId = req.params.userid

  try {
    const user = await User.findById(userId).populate("genres instruments")
    if (!user) {
      return res.status(404).json({message: "User not found! "})
    }
    return res.status(200).json({user})
  } catch (error) {
    res.status(500).json({error})
  }
}

const updateUser = async (req, res) => {
  const userId = req.params.userId
  try {
    if (userId) {
      const user = await User.findById(userId).populate("genres instruments")
      if (!user) {
        return res.status(404).json({message: "USER not found!"})
      }
    }
    await User.updateOne({_id: userId}, req.body)
    return res.status(200).json({message: "User Updated"})
  } catch (error) {
    return res.status(500).json({error})
  }
}

const deleteUserById = async (req, res) => {
  const userId = req.params.userid
  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({message: "User not found!"})
    }
    await User.deleteOne({_id: userId})
    return res.status(200).json({message: `User id: ${userId} Deleted`})
  } catch (error) {
    res.status(500).json({error})
  }
}

const getJemerCardDataByEmail = async (req, res) => {
  const email = req.params.useremail

  try {
    const user = await User.findOne({email}).populate("genres instruments")

    return res.status(200).json({user})
  } catch (error) {
    res.status(500).json({error})
  }
}

const reportUser = async (req, res) => {
  try {
    const {reportedUserId, userId, reason} = req.body

    const reportedUser = await User.findById(reportedUserId)
    if (!reportedUser) {
      return res.status(404).json({message: "Reported user not found."})
    }

    reportedUser.reports.push({
      reporter: userId,
      reason,
    })
    await reportedUser.save()

    res.status(200).json({message: "User reported successfully."})
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Internal server error."})
  }
}

module.exports = {
  getAllUsers,
  deleteUserById,
  getJemerCardDataById,
  updateUser,
  getJemerCardDataByEmail,
  getAllUsersByGenreId,
  getUsernames,
  getUsersFiltered,
  getUsersByUsername,
  reportUser,
}
