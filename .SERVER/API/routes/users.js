const express = require("express")
const router = express.Router()
const verifyAdminToken = require("../middlewares/checkAdminAuth")
const verifyToken = require("../middlewares/checkAuth")

const {
  signup,
  login,
  getAllUsers,
  deleteUserById,
  getJemerCardDataById,
  updateUser,
  getJemerCardDataByEmail,
  getAllUsersByGenreId,
} = require("../controllers/users")

router.post("/signup", signup)
router.post("/login", login)

// router.get("/getallusers", verifyToken, getAllUsers);

// router.get("/getjemercarddatabyid/:userid", verifyToken, getJemerCardDataById);

// router.delete("/deleteuserbyid/:userid", verifyAdminToken, deleteUserById);

// router.patch('/patchuserbyid/:userId', verifyToken, updateUser)

router.get("/getallusers", getAllUsers)

router.get("/getallusersbyganer/:genreid", getAllUsersByGenreId)

router.get("/getjemercarddatabyid/:userid", getJemerCardDataById)

router.get("/getjemercarddatabyemail/:useremail", getJemerCardDataByEmail)

router.delete("/deleteuserbyid/:userid", deleteUserById)

router.patch("/patchuserbyid/:userId", updateUser)

module.exports = router
