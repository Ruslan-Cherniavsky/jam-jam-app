const mongoose = require("mongoose")
const Genres = require("../models/genres")

const addGenre = async (req, res) => {
  const {genre} = req.body

  try {
    const genreFromDb = await Genres.find({genre})
    if (genreFromDb.length >= 1) {
      return res.status(409).json({message: "Music genre exists!"})
    }

    const newGenres = new Genres({
      _id: new mongoose.Types.ObjectId(),
      genre: genre,
    })

    await newGenres.save()
    console.log(newGenres)
    return res
      .status(200)
      .json({message: "New music genre created ! LETS PLAY"})
  } catch (error) {
    return res.status(500).json({error})
  }
}

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genres.find()
    return res.status(200).json({genres})
  } catch (error) {
    res.status(500).json({error})
  }
}

const deleteGenresById = async (req, res) => {
  const genreId = req.params.genreid
  try {
    const genere = await Genres.findById(genreId)
    if (!genere) {
      return res.status(404).json({message: "Musical gener not found!"})
    }
    await Genres.deleteOne({_id: genere._id})
    return res
      .status(200)
      .json({message: `Gener id: ${genere._id} DELETED !!!! `})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  addGenre,
  getAllGenres,
  deleteGenresById,
}
