const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next)=>{
    // console.log('auth middleware is called');
    const authHeaders = req.headers.authorization  // reads authorization header from the incoming request
    console.log(authHeaders);
    const token = authHeaders && authHeaders.split(" ")[1]  // If authHeaders exists, then split it and take the token part.

    // checking if token is valid
    if(!token){
        return res.status(401).json({
            success : false,
            message : 'Access Denied! Invaild Token; Please Login to continue'
        })
    }
    // decode this token

    try {
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY)
        console.log(decodedToken);
        req.userInfo = decodedToken
        
        // We use req.something to pass data from middleware to route.
        //We don’t use res.something because res is meant to send response, not carry data forward.

        next();

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'Access Denied! Invaild Token; Please Login to continue'
        })
    }
    // next();
}


module.exports = authMiddleware


// HTTP headers are key–value pairs sent between a client and a server as part of an HTTP request or response, used to transmit metadata about the request or response.
/*
Example Request Header
GET /profile HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

Here:
    Host → tells which server
    Authorization → carries the token
    Content-Type → tells what type of data is being sent
*/

// headers are metadata fields , which provides info such as server details , authentication , content-type


// We use req because : We are passing information forward to the next function.

// We use res when : We want to send response to client.