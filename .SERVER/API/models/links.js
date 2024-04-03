const mongoose = require("mongoose")

const linksSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  link: {type: String, min: 2, max: 700},
})

module.exports = mongoose.model("Links", linksSchema)
