const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const router = express.Router()

router.get('/welcome' ,authMiddleware,adminMiddleware, (req,res)=>{
    res.json({
        message : 'Welcome to the Admin Page'
    })
})



module.exports = router


// here first we are verifying user using authMiddleware , if the info is correct it will return an object req.userInfo which will contain an user info, after that adminMiddleware is called , and it will check whether client is 'user' or 'admin' using the condition === if(req.userInfo.role != 'admin') ==== , if the client is admin , we will see message 'Welcome to the Admin Page';