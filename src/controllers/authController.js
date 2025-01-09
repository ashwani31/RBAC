const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/otpModel");

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: `User registered: ${username}` });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        console.log(user);


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OTP.create({ userId: user._id, otp, expiresAt });
        res.status(200).json({ message: "OTP sent", otp, "userId": user._id });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const otpEntry = await OTP.findOne({ userId, otp });
        if (!otpEntry || otpEntry.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await OTP.deleteOne({ _id: otpEntry._id });

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "OTP verified", token });

    } catch (err) {
        res.status(500).json({ message: "Error verifying OTP" });
    }
};
