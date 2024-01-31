const mongoose = require("mongoose")

const genresSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  genre: {type: String, required: true, min: 2, max: 60},
})

module.exports = mongoose.model("Genres", genresSchema)
