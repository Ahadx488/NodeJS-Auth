const express = require('express')
const router = express.Router()
const {registerUser , loginUser , ChangePassword} = require('../controllers/auth-controllers')

const authMiddleware = require('../middleware/auth-middleware')
// all routes are related to authentication & authorization
router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.post("/change-password" , authMiddleware, ChangePassword)




module.exports = router