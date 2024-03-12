const mongoose = require("mongoose")
const User = require("../models/user")
const Genres = require("../models/genres")
const jwt = require("jsonwebtoken")
const md5 = require("md5")

const signup = async (req, res) => {
  const {
    email,
    userName,
    firstName,
    lastName,
    country,
    city,
    street,
    age,
    gender,
    genres,
    instruments,
    img,
    references,
    oboutMe,
    links,
    role,
    dob,
  } = req.body

  try {
    const users = await User.find({email})
    if (users.length >= 1) {
      return res.status(409).json({message: "Email exists!"})
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      country: country,
      city: city,
      street: street,
      age: age,
      gender: gender,
      genres: genres,
      instruments: instruments,
      img: img,
      references: references,
      oboutMe: oboutMe,
      role: role,
      links: links,
      dob: dob,
    })

    await user.save()
    console.log(user)
    return res.status(200).json({message: "User Created !"})
  } catch (error) {
    return res.status(500).json({error})
  }
}

const login = async (req, res) => {
  const {email, password} = req.body
  try {
    const users = await User.find({email})
    if (users.length === 0) {
      return res.status(401).json({message: "Auth failed!"})
    }
    const [user] = users

    if (user.password !== md5(password)) {
      return res.status(404).json({message: "Auth failed!"})
    }

    const token = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        city: user.city,
        musicalGaners: user.musicalGaners,
        musicalInstruments: user.musicalInstruments,
        street: user.street,
        role: user.role,
      },
      process.env.JWT_KEY,
      {expiresIn: "50H"}
    )

    return res.status(200).json({message: "Auth success!", token: token})
  } catch (error) {
    return res.status(500).json({error})
  }
}

// const getAllUsers = async (req, res) => {
//   try {
//     // const users = await User.find()
//     const users = await User.find().populate("genres instruments")
//     return res.status(200).json({users})
//   } catch (error) {
//     res.status(500).json({error})
//   }
// }

const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1 // Get the requested page from query parameters
  const perPage = 12 // Set the number of users per page

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
  const page = parseInt(req.query.page) || 1 // Get the requested page from query parameters
  const perPage = 12 // Set the number of users per page
  const params = req.query
  try {
    const queryConditions = {}

    console.log("Params:", params)

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

    // Check if there are any conditions specified
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

  console.log(searchText)

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
    // const users = await User.find()
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
    console.log(genre)

    // const users = await User.find(musicalGaner)
    // return res.status(200).json({users})
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
    console.log(user)
    if (!user) {
      return res.status(404).json({message: "User not found!"})
    }
    return res.status(200).json({user})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  deleteUserById,
  getJemerCardDataById,
  updateUser,
  getJemerCardDataByEmail,
  getAllUsersByGenreId,
  getUsernames,
  getUsersFiltered,
  getUsersByUsername,
}
