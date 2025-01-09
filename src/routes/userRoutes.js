
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/admin", verifyToken(["admin"]), (req, res) => {
    res.json({ message: "only admin access" });
});

router.get("/manager", verifyToken(["admin", "manager"]), (req, res) => {
    res.json({ message: "admin and manager access" });
});

router.get("/user", verifyToken(["admin", "manager", "user"]), (req, res) => {
    res.json({ message: "admin, manager and user access" });
});

module.exports = router;
