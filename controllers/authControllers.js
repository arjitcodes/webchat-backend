const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");




const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    // const { username, password } = req.body;
    const password = req.body.pwd;
    const username = req.body.user;
    try {

        if (!username || !password) return res.sendStatus(400);

        if (!validator.isStrongPassword(password)) return res.status(403).json({ error: "Invalid creadientials" });
        let foundUser;

        if (validator.isEmail(username)) {
            foundUser = await User.findOne({ email: username });
            // console.log("foundUser " + foundUser)
        } else {

            foundUser = await User.findOne({ username });
        }
        if (!foundUser) return res.status(403).json({ error: "Invalid creadientials" });

        const isPwdMatch = await bcrypt.compare(password, foundUser.password);

        if (!isPwdMatch) return res.status(403).json({ error: "Invalid creadientials" });

        const accessToken = jwt.sign({ "id": foundUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
        const newRefreshToken = jwt.sign({ "id": foundUser.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        const newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)

        if (cookies?.jwt) res.clearCookie('jwt', { httpOnly: true })

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await foundUser.save();
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(201).json({ accessToken })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server problem! we are back soon." })
    }
}


const handleIsVerified = async (req, res) => {
    // console.log(req.cookies)
    const isUserValid = req.token;
    // console.log(`req.token : ${isUserValid}`)
    if (isUserValid) {
        const token = req.token;
        return res.json({ token });
    } else {
        res.sendStatus(409);
    }
}




module.exports = { handleLogin, handleIsVerified };