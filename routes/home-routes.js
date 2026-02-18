const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')
// The middleware function (authMiddleware) checks the token before allowing access to the route. If the token is valid, it calls next() and the user can access the route. If invalid, access is denied.

router.get('/welcome' , authMiddleware, (req,res)=>{
    const {username , userId , role} =req.userInfo
    res.json({
        message : 'Welcome to Homepage',
        user : {
            _id : userId,
            username,
            role
        }
    })
})

module.exports = router