
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// const verifyToken = async (req, res, next) => {
//     let token;
//     const authHeader = req.headers.Authorization || req.headers.authorization;

//     if (authHeader && authHeader.startsWith("Bearer")) {
//         token = authHeader.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ message: "No token, authorization denied" });
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded;
//             let id = req.user.id;
//             const user = await User.findOne({ _id:id });
//             console.log(user.role);
//             // next();
//         } catch (err) {
//             res.status(400).json({ message: "Token is not valid" });
//         }
//     } else {
//         return res.status(401).json({ message: "No token provided" });
//     }
// };

const verifyToken = (allowedRoles = []) => {
    return async (req, res, next) => {
        let token;
        const authHeader = req.headers.Authorization || req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: "No token, authorization denied" });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;

                const user = await User.findOne({ _id: req.user.id });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                req.user.role = user.role; 

                // Check if the user's role is allowed
                if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                    return res.status(403).json({ message: "Access denied: Insufficient permissions" });
                }

                // Send response directly for allowed roles if needed
                if (allowedRoles.length > 0) {
                    return res.json({
                        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} access granted`,
                        role: user.role,
                    });
                }

                next();
            } catch (err) {
                return res.status(400).json({ message: "Token is not valid" });
            }
        } else {
            return res.status(401).json({ message: "No token provided" });
        }
    };
};


module.exports = verifyToken;
