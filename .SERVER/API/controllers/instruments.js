const mongoose = require("mongoose")
const Instruments = require("../models/instruments")

const addInstrument = async (req, res) => {
  const {instrument} = req.body

  try {
    const instrumentFromDb = await Instruments.find({instrument})
    if (instrumentFromDb.length >= 1) {
      return res.status(409).json({message: "Musical Instrument exists!"})
    }

    const newInstrument = new Instruments({
      _id: new mongoose.Types.ObjectId(),
      instrument: instrument,
    })

    await newInstrument.save()
    console.log(newInstrument)
    return res.status(200).json({message: "New Instrument Created ! LETS PLAY"})
  } catch (error) {
    return res.status(500).json({error})
  }
}

const getAllInstruments = async (req, res) => {
  try {
    const instruments = await Instruments.find()
    return res.status(200).json({instruments})
  } catch (error) {
    res.status(500).json({error})
  }
}

const deleteInstrumentById = async (req, res) => {
  const instrumentId = req.params.instrumentid
  try {
    const instrument = await Instruments.findById(instrumentId)
    if (!instrument) {
      return res.status(404).json({message: "Musical Instrument not found!"})
    }
    await Instruments.deleteOne({_id: instrumentId})
    return res
      .status(200)
      .json({message: `Instrument id: ${instrumentId} DELETED !!!! `})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  addInstrument,
  getAllInstruments,
  deleteInstrumentById,
}
