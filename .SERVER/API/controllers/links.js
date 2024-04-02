const mongoose = require("mongoose")
const Links = require("../models/links")

const addLink = async (req, res) => {
  const {link} = req.body

  try {
    const linkFromDb = await Links.find({link})
    if (linkFromDb.length >= 1) {
      return res.status(409).json({message: "Social link exists!"})
    }

    const newLinks = new Links({
      _id: new mongoose.Types.ObjectId(),
      link: link,
    })

    await newLinks.save()
    console.log(newLinks)
    return res.status(200).json({message: "New social link created"})
  } catch (error) {
    return res.status(500).json({error})
  }
}

const getAllLinks = async (req, res) => {
  try {
    const linsk = await Links.find()
    return res.status(200).json({linsk})
  } catch (error) {
    res.status(500).json({error})
  }
}

const deleteLinksById = async (req, res) => {
  const linkId = req.params.genreid
  try {
    const link = await Links.findById(linkId)
    if (!link) {
      return res.status(404).json({message: "Social link not found!"})
    }
    await Links.deleteOne({_id: link._id})
    return res.status(200).json({message: `Link id: ${link._id} DELETED !!!! `})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
  addLink,
  getAllLinks,
  deleteLinksById,
}
