const express = require("express")
const router = express.Router()
// const verifyAdminToken = require("../middlewares/checkAdminAuth")
// const verifyToken = require("../middlewares/checkAuth")

const {
  getAllUsers,
  deleteUserById,
  getJemerCardDataById,
  updateUser,
  getJemerCardDataByEmail,
  getAllUsersByGenreId,
  getUsernames,
  getUsersFiltered,
  getUsersByUsername,
  reportUser,
} = require("../controllers/users")

router.get("/getallusers", getAllUsers)

router.get("/jammersfetchfiltered", getUsersFiltered)

router.get("/jammersfetchbysearch", getUsersByUsername)

router.post("/reportuser", reportUser)

//---

router.get("/getjemerusernames", getUsernames)

router.get("/getallusersbyganer/:genreid", getAllUsersByGenreId)

router.get("/getjemercarddatabyid/:userid", getJemerCardDataById)

router.get("/getjemercarddatabyemail/:useremail", getJemerCardDataByEmail)

router.delete("/deleteuserbyid/:userid", deleteUserById)

router.patch("/patchuserbyid/:userId", updateUser)

module.exports = router
