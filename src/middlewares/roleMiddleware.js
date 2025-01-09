
// const authorizeRoles = (...allowedRoles) => {
//     // console.log(allowedRoles)

//     return (req, res, next) => {
//         if (!allowedRoles.includes(req.body.role)) {
//             return res.status(403).json({ message: "Access Denied" });
//         }
//         next();
//     };
// };

// module.exports = authorizeRoles;
