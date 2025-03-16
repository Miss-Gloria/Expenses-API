import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified; 

        next(); 
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

export default auth;
