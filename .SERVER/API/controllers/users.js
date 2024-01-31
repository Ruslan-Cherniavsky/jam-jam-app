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
    ganers,
    instruments,
    img,
    references,
    oboutMe,
    role,
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
      ganers: ganers,
      instruments: instruments,
      img: img,
      references: references,
      oboutMe: oboutMe,
      role: role,
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

const getAllUsers = async (req, res) => {
  try {
    // const users = await User.find()
    const users = await User.find().populate("ganers instruments")
    return res.status(200).json({users})
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
    const user = await User.findById(userId)
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
      const user = await User.findById(userId)
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
    const user = await User.findOne({email})
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
}
