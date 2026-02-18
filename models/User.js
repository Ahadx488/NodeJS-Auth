const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum  : ['user' , 'admin'], // only allow 'user' or 'admin' roles
        default : 'user'
    }
} , {timestamps :true})

module.exports = mongoose.model('User' , UserSchema)



// bcrypt is a library used to securely hash passwords before storing them in the database, so plain passwords are never saved.
// During login, bcrypt.compare() checks the entered password against the stored hashed password.
// It uses salting and slow hashing to protect against brute-force and password attacks. 🔐

//bcrypt does 3 important things: 1️⃣ Hashing 2️⃣ Salting 3️⃣ Slow computation (to prevent brute force)