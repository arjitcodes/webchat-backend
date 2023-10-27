
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');



const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    try {

        if (!cookies?.jwt) return res.sendStatus(401);

        const refreshToken = cookies.jwt;

        res.clearCookie('jwt', { httpOnly: true, secure: true })

        const foundUser = await User.findOne({ refreshToken }).exec();


        // Detected refresh token reUse!
        if (!foundUser) {
            console.log('foundUser ;;;;;;;;;;;    ;;;;;    ' + foundUser)
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                if (err) return res.sendStatus(419);//forbiden
                const hackedUser = await User.findById(decoded.id);
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            })
            return res.sendStatus(415);//forbiden
        }


        const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);


        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...newRefreshTokenArray]
                // console.log(err)
                await foundUser.save();

            }



            if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

            const accessToken = jwt.sign({ "id": decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });

            const newRefreshToken = jwt.sign({ "id": foundUser.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]

            const tryUSER = await foundUser.save();


            res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

            res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server problem! we are back soon." })
    }
}





module.exports = handleRefreshToken;