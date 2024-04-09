const mongoose = require("mongoose")

const jamRequestSchema = mongoose.Schema({
  jamId: {type: mongoose.Schema.Types.ObjectId, ref: "Jam"},
  instrumentId: {type: mongoose.Schema.Types.ObjectId, ref: "Instruments"},
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
})

module.exports = mongoose.model("JamRequestSchema", jamRequestSchema)
