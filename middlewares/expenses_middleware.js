import jwt from "jsonwebtoken";

 //This function auth is like a security guard. It checks if the person (user) has the right ticket (token) before letting them in.
const auth = (req, res, next) => {  
    try {
        const token = req.header("Authorization");  //When someone makes a request, we check their pocket (headers) for a ticket (token)

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." }); // no token then error.
        }

        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET); // check if the ticket is real 
        req.user = verified; 

        next(); 
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." }); // if not then error
    }
};

export default auth;
