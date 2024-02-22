const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  userName: {type: String, min: 5, max: 30},

  firstName: {type: String, min: 5, max: 30},
  lastName: {type: String, min: 5, max: 30},

  country: {type: String, min: 5, max: 60},
  isoCode: {type: String, min: 5, max: 60},
  city: {type: String, min: 5, max: 90},
  region: {type: String, min: 5, max: 130},

  age: {type: Number, min: 10, max: 130},
  gender: {type: String},

  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genres",
    },
  ],
  instruments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instruments",
    },
  ],

  img: {type: String},
  references: {type: String, max: 300},
  oboutMe: {type: String, max: 700},
  //TODO -----

  links: [{type: String, min: 5, max: 700}],

  // friends: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Friends",
  //   },
  // ],
  // jamesCreated: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Friends",
  //   },
  // ],
  // jamesJoined: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Friends",
  //   },
  // ],

  createdAt: {type: Date, immutable: true, default: () => Date.now()},
  role: {type: String, default: "user", required: true},
})

module.exports = mongoose.model("User", userSchema)
