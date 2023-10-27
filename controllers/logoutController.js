
const User = require("../models/userModel");




const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.jwt) return res.status(204);
        console.log(cookies.jwt)

        const refreshToken = cookies.jwt;

        const foundUser = await User.findOne({ refreshToken })

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(204);
        }

        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);

        await foundUser.save();
        res.clearCookie('jwt', { httpOnly: true});//secure:true -Only serve on https;
        return res.sendStatus(204);


    } catch (error) {
        res.status(500).json({ error: "Server problem! we are back soon." })
    }
}





module.exports = handleLogout;