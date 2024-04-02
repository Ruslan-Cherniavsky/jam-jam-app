const mongoose = require("mongoose")

const instrumentsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  instrument: {type: String, required: true, min: 2, max: 60},
})

module.exports = mongoose.model("Instruments", instrumentsSchema)
