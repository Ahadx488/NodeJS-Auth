const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')

// register controller

const registerUser = async(req,res) =>{
    try {
        // extract user information from our request body
        const {username , email , password , role} = req.body

        // check if the user already exist in our database
        const checkExistingUser = await User.findOne({$or : [
            {username},
            {email}
        ]}) // or will check user exists or not

        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'user with this username or email already exist, please try with a different username or email'
            })
        }

        // hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        // create a new user in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password :hashedPassword,
            role : role || 'user'
        })

        await newlyCreatedUser.save()

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : 'User registered successfully',

            })
        }else{
            resizeBy.status(400).json({
                success : false,
                message : 'Unable to register user! Please try again'
            })
        }
    } catch (error) {
        console.log(error);
        resizeBy.status(500).json({
            success : false,
            message : 'some error occured! please try again'
        })
    }
}

// login controller

const loginUser = async(req,res)=>{
    try {
        const {username , password} = req.body
    
        // find if the current user exists in database or not
        const user = await User.findOne({username}) // 'user' will hold all the info of user with username
        if(!user){
            return res.status(400).json({
                success :false,
                message : 'User doesnot exist!'
            })
        }
        
        // Check Password

        const checkPassword = await bcrypt.compare(password , user.password)

        if(!checkPassword){
            return res.status(400).json({
                success :false,
                message : 'Wrong Password!'
            })
        }

        // create user token (Bearer : Bearer simply means:“I am carrying this token.”)
        // Authorization: Bearer <token>
        
        // Signature ensures the token is authentic and not tampered with.
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        }, process.env.JWT_SECRET_KEY , {
            expiresIn : '15m'
        })

        res.status(200).json({
            success : true,
            message : 'login successfull',
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : 'false',
            message : 'some error occured! please try again'
        })
    }
}

const ChangePassword = async (req,res)=>{
    try {
        const userId = req.userInfo.userId

        // Extract old and new Passwords
        const {oldPassword , newPassword} = req.body

        // find current logged in user
        const user = await User.findById(userId)

        if(!user){
            res.status(400).json({
                success : false,
                message : 'User not found'
            })
        }

        // check if the old password is correct or not
        const isPasswordMatch = await bcrypt.compare(oldPassword , user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success : false,
                message : 'Old Password is not correct! Please try again'
            })
        }

        // hash the new password
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword , salt)

        // update user password
        user.password = newHashedPassword
        await user.save();

        res.status(200).json({
            success : true,
            message : 'Password changed successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : 'false',
            message : 'some error occured! please try again'
        })
    }
}
module.exports = {registerUser , loginUser , ChangePassword}