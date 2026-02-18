// Authentication verifies identity using credentials stored in the database. Authorization checks whether the authenticated user has permission to perform a specific action.

// Authentication verifies identity. Authorization verifies permissions.


require('dotenv').config()
const express = require('express')
const connectToMongodb = require('./database/db')
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes')
const uploadImageRoutes = require('./routes/image-routes')
connectToMongodb()

const app = express()
const PORT = process.env.PORT || 3000


// middleware
app.use(express.json())
app.use('/api/auth' , authRoutes)
app.use('/api/home' , homeRoutes)
app.use('/api/admin' , adminRoutes)
app.use('/api/image' , uploadImageRoutes)

app.listen(PORT , ()=>{
    console.log(`Server is now listening to PORT ${PORT}`)
})
