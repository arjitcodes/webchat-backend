const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
    
    const { id } = req.params;
    try {
        if (!id) return res.status(404).json({ error: "Invalid request" });

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "Invalid request" });
        }
        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: "Server problem! we are back soon." })
    }

}




const putUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(404).json({ error: "Invalid request" });


        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: "Invalid request" });
        }
        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: "Server problem! we are back soon." })
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(404).json({ error: "Invalid request" });


        const user = await User.findByIdAndDelete(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: "Invalid request" });
        }
        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({ error: "Server problem! we are back soon." })
    }
}



const postUser = async (req, res) => {
    const { name, email, pwd, bio } = req.body;
    const cookies = req.cookies;

    console.log(req.body)
    try {
        if (!name || !pwd || !email) {
            return res.status(404).json({ error: "Fill credientials" });
        }
        if (!validator.isEmail(email)) {
            return res.status(404).json({ error: "Invalid email" })
        }
        if (!validator.isStrongPassword(pwd)) {
            return res.status(404).json({ error: "Weak password" })
        }

        const hashPwd = await bcrypt.hash(pwd, 10);

        const willUser = new User({ name, email, password: hashPwd, bio })

        // const user = await willUser.save()

        const accessToken = jwt.sign({ "username": willUser.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
        const newRefreshToken = jwt.sign({ "username": willUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // const newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt => rt !== cookies.jwt)

        if (cookies?.jwt) res.clearCookie('jwt', { httpOnly: true })

        willUser.refreshToken = [newRefreshToken];
        await willUser.save();
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ success: true, accessToken })

        // res.json({ success: true, user })


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server problem! we are back soon." })

    }
}



module.exports = { getUser, postUser, putUser, deleteUser }