const mongoose = require("mongoose")

const jamSchema = mongoose.Schema({
  img: {type: String},
  jamName: {type: String, maxlength: 30},
  hostedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  jamDate: {type: Date},
  country: {type: String, maxlength: 60},
  isoCode: {type: String, maxlength: 60},
  city: {type: String, maxlength: 90},
  region: {type: String, maxlength: 130},
  type: {type: String},
  entrance: {type: String},
  tune: {type: String},
  jamDescription: {type: String, maxlength: 700},
  genres: [{type: mongoose.Schema.Types.ObjectId, ref: "Genres"}],
  sharedInstruments: [
    {type: mongoose.Schema.Types.ObjectId, ref: "Instruments"},
  ],
  jammers: [
    {
      instrument: {type: mongoose.Schema.Types.ObjectId, ref: "Instruments"},
      maxNumberOfJammers: {type: Number},
      jammersId: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
  ],
  audience: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  reports: [
    {
      reporter: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
      reason: String,
      date: {type: Date, default: Date.now},
    },
  ],
  createdAt: {type: Date, immutable: true, default: Date.now},
})

module.exports = mongoose.model("Jam", jamSchema)
